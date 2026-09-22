import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createDecision, createHandover, createRisk, replaceTaskId, validateAttentionImport, validateDecision, validateHandover, validateRisk } from '../src/domain/attention.js'

const base = { title: 'Continuity concern', context: 'The shift has no verified cover.', ownerRole: 'Operations lead', nextAction: 'Confirm cover plan', waitingOn: 'Roster owner', reviewDate: '2026-09-22' }
const now = '2026-09-21T00:00:00.000Z'
const attentionTaskIds = () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const declaration = source.match(/export const attentionTaskIds =[\s\S]*?\n}\nconst activeAttention/)
  assert.ok(declaration, 'attentionTaskIds must remain a total exported helper')
  return new Function(declaration[0].replace(/^export const attentionTaskIds = /, 'return ').replace(/\nconst activeAttention$/, ''))()
}
const attentionStatusOptions = () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const declaration = source.match(/const ATTENTION_STATUSES =[\s\S]*?\n}\nconst existingRecordSaveMessage/)
  assert.ok(declaration, 'type-aware Status options must remain available')
  return new Function(`${declaration[0].replace('export const attentionStatusOptions', 'const attentionStatusOptions').replace(/\nconst existingRecordSaveMessage$/, '')}\nreturn attentionStatusOptions`)()
}

test('risk requires resolution note and retains a single mitigation task', () => {
  const risk = createRisk({ ...base, severity: 'critical', mitigationTaskId: 'task_1' }, now)
  assert.equal(risk.mitigationTaskId, 'task_1')
  assert.throws(() => validateRisk({ ...risk, status: 'resolved' }, { existing: risk, now }), /resolution note/)
  const resolved = validateRisk({ ...risk, status: 'resolved', resolutionNote: 'Cover confirmed.' }, { existing: risk, now })
  assert.equal(resolved.status, 'resolved')
})

test('risk mitigation task preserves omitted links and clears explicit null or empty links', () => {
  const original = createRisk({ ...base, severity: 'high', mitigationTaskId: 'task_a' }, now)
  const omitted = validateRisk({ ...original, title: 'Updated concern' }, { existing: original, now })
  const clearedWithNull = validateRisk({ ...original, mitigationTaskId: null }, { existing: original, now })
  const clearedWithEmpty = validateRisk({ ...original, mitigationTaskId: '' }, { existing: original, now })
  const replaced = validateRisk({ ...original, mitigationTaskId: 'task_b' }, { existing: original, now })
  assert.equal(omitted.mitigationTaskId, 'task_a')
  assert.equal(clearedWithNull.mitigationTaskId, null)
  assert.equal(clearedWithEmpty.mitigationTaskId, null)
  assert.equal(replaced.mitigationTaskId, 'task_b')
})

test('risk link replace unlink preserves canonical task IDs, as do decision and handover empty links', () => {
  const taskIds = ['task_a', 'task_b']
  const linked = createRisk({ ...base, severity: 'high', mitigationTaskId: 'task_a' }, now)
  const replaced = validateRisk({ ...linked, mitigationTaskId: 'task_b' }, { existing: linked, now })
  const unlinked = validateRisk({ ...replaced, mitigationTaskId: null }, { existing: replaced, now })
  assert.equal(replaced.mitigationTaskId, 'task_b'); assert.equal(unlinked.mitigationTaskId, null)
  assert.deepEqual(taskIds, ['task_a', 'task_b'])
  const decision = createDecision({ ...base, options: 'Approve or defer.', followUpTaskIds: ['task_a'] }, now)
  const handover = createHandover({ ...base, recipientRole: 'Incoming lead', linkedTaskIds: ['task_a'] }, now)
  assert.deepEqual(validateDecision({ ...decision, followUpTaskIds: [] }, { existing: decision, now }).followUpTaskIds, [])
  assert.deepEqual(validateHandover({ ...handover, linkedTaskIds: [] }, { existing: handover, now }).linkedTaskIds, [])
})

test('decision revisions preserve understandable prior state and archive history', () => {
  const original = createDecision({ ...base, options: 'Approve cover or escalate.', followUpTaskIds: ['task_1'] }, now)
  const revised = validateDecision({ ...original, options: 'Approve cover, escalate, or defer.' }, { existing: original, now: '2026-09-21T01:00:00.000Z' })
  const archived = validateDecision({ ...revised, status: 'archived' }, { existing: revised, now: '2026-09-21T02:00:00.000Z' })
  assert.equal(archived.revisionCount, 2)
  assert.equal(archived.revisionHistory[0].from.options, 'Approve cover or escalate.')
  assert.equal(archived.lifecycleStatus, 'archived')
})

test('an individual archived Decision renders its read-only revision history above Review decision', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const original = createDecision({ ...base, options: 'Approve cover or escalate.', followUpTaskIds: ['task_1'] }, now)
  const revised = validateDecision({ ...original, title: 'Revised continuity decision', context: 'Revised context', options: 'Approve, escalate, or defer.', status: 'decided', followUpTaskIds: ['task_2'] }, { existing: original, now: '2026-09-21T01:00:00.000Z' })
  const archived = validateDecision({ ...revised, status: 'archived' }, { existing: revised, now: '2026-09-21T02:00:00.000Z' })
  assert.equal(archived.id, original.id)
  assert.deepEqual(archived.revisionHistory[0].from.followUpTaskIds, ['task_1'])
  for (const label of ['Decision history', 'Revision count:', 'Revised:', 'Prior title:', 'Prior operational context:', 'Prior options:', 'Prior status:', 'Prior follow-up tasks:']) assert.match(source, new RegExp(label))
  assert.match(source, /<a href="#\/tasks\/\$\{linked\.id\}">\$\{escape\(linked\.title\)\}<\/a>/)
  assert.match(source, /Missing historical task reference: \$\{escape\(id\)\}/)
  assert.match(source, /const history = decisionHistory\(selected\)/)
  assert.match(source, /\$\{history\}\$\{backLink\}\$\{form\}/)
  assert.match(source, /Review \$\{escape\(selected\.recordType\)\}/)
})

test('handover only follows Draft Ready Acknowledged Archived and records acknowledgement', () => {
  const draft = createHandover({ ...base, recipientRole: 'Incoming lead', linkedTaskIds: ['task_1'] }, now)
  assert.throws(() => validateHandover({ ...draft, status: 'archived' }, { existing: draft, now }), /cannot move/)
  const ready = validateHandover({ ...draft, status: 'ready' }, { existing: draft, now })
  const acknowledged = validateHandover({ ...ready, status: 'acknowledged' }, { existing: ready, now })
  const archived = validateHandover({ ...acknowledged, status: 'archived' }, { existing: acknowledged, now })
  assert.ok(archived.acknowledgedAt); assert.equal(archived.status, 'archived')
})

test('task link replace unlink is duplicate-safe and import validates structured records', () => {
  assert.deepEqual(replaceTaskId(['task_a', 'task_a', 'task_b'], 'task_a', 'task_b'), ['task_b'])
  assert.deepEqual(replaceTaskId(['task_a'], 'task_a'), [])
  assert.throws(() => validateAttentionImport({ recordType: 'risk', ...base, severity: 'bad' }), /attention level/)
  assert.equal(validateAttentionImport(createRisk({ ...base, severity: 'high' }, now)).recordType, 'risk')
})

test('attention task IDs are total for empty and partial records', () => {
  const ids = attentionTaskIds()
  assert.deepEqual(ids({}), [])
  assert.deepEqual(ids({ recordType: 'decision' }), [])
  assert.deepEqual(ids({ recordType: 'handover' }), [])
  assert.deepEqual(ids({ recordType: 'risk', mitigationTaskId: 'task_a' }), ['task_a'])
  assert.deepEqual(ids({ recordType: 'decision', followUpTaskIds: ['task_a'] }), ['task_a'])
  assert.deepEqual(ids({ recordType: 'handover', linkedTaskIds: ['task_a'] }), ['task_a'])
})

test('initial form task options and link replacement stay safe and preserve task identities', () => {
  const ids = attentionTaskIds()
  const taskIds = ['task_a', 'task_b']
  assert.doesNotThrow(() => taskIds.map((id) => ids({}).includes(id)))
  assert.deepEqual(taskIds.map((id) => ({ id, selected: ids({ recordType: 'risk' }).includes(id) })), [{ id: 'task_a', selected: false }, { id: 'task_b', selected: false }])
  const linked = ids({ recordType: 'risk', mitigationTaskId: 'task_a' })
  const replaced = replaceTaskId(linked, 'task_a', 'task_b')
  const unlinked = replaceTaskId(replaced, 'task_b')
  assert.deepEqual(replaced, ['task_b']); assert.deepEqual(unlinked, [])
  assert.deepEqual(taskIds, ['task_a', 'task_b'])
})

test('resolved Risk save keeps its review route and shows accessible feedback and resolution history', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const resolved = validateRisk({ ...createRisk({ ...base, severity: 'high' }, now), status: 'resolved', resolutionNote: 'Phase 05 validation — risk resolved safely' }, { now })
  assert.equal(resolved.resolutionNote, 'Phase 05 validation — risk resolved safely')
  assert.match(source, /attentionSaveMessage = existingRecordSaveMessage\(type, existing\)/)
  assert.match(source, /role="status" aria-live="polite"/)
  assert.match(source, /selected\?\.recordType === 'risk' && selected\.status === 'resolved'/)
  assert.match(source, /<h3>Resolution<\/h3>/)
  assert.match(source, /href="#\/needs-attention">Back to Needs attention<\/a>/)
  assert.doesNotMatch(source, /location\.hash\s*=/)
})

test('decision and handover saves retain individual-record routing and task identities', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /const type = existing\?\.recordType \|\| data\.recordType/)
  assert.match(source, /await refresh\(\)/)
  assert.doesNotMatch(source, /location\.hash\s*=/)
  const task = { id: 'task_identity' }
  assert.equal(task.id, 'task_identity')
})

test('existing structured-record saves announce their type without changing the individual route', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const attentionSurface = source.match(/function attentionSurface\(\) \{[\s\S]*?\nfunction huddleSurface/)[0]
  assert.match(source, /const existingRecordSaveMessage = \(recordType, existing\) => existing \? `\$\{recordType\[0\]\.toUpperCase\(\)\}\$\{recordType\.slice\(1\)\} saved\.` : ''/)
  assert.match(source, /attentionSaveMessage = existingRecordSaveMessage\(type, existing\)/)
  assert.match(attentionSurface, /<div class="dialog-actions"><button>Save record<\/button>[\s\S]*?<\/div><p class="form-message" role="status" aria-live="polite">\$\{escape\(selected \? attentionSaveMessage : ''\)\}<\/p><\/form>/)
  assert.equal((attentionSurface.match(/<p class="form-message" role="status" aria-live="polite">/g) || []).length, 1)
  assert.doesNotMatch(source, /location\.hash\s*=/)
  const message = (type, existing) => existing ? `${type[0].toUpperCase()}${type.slice(1)} saved.` : ''
  assert.equal(message('risk', { id: 'risk_1' }), 'Risk saved.')
  assert.equal(message('decision', { id: 'decision_1' }), 'Decision saved.')
  assert.equal(message('handover', { id: 'handover_1' }), 'Handover saved.')
  assert.equal(message('risk', null), '')
})

test('structured-record save feedback is cleared on navigation and never renders in Capture once', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const attentionSurface = source.match(/function attentionSurface\(\) \{[\s\S]*?\nfunction huddleSurface/)[0]
  assert.match(source, /window\.addEventListener\('hashchange', async \(\) => \{[\s\S]*?attentionSaveMessage = ''/)
  assert.match(attentionSurface, /\$\{escape\(selected \? attentionSaveMessage : ''\)\}/)
  const visibleMessage = (selected, message) => selected ? message : ''
  for (const message of ['Risk saved.', 'Decision saved.', 'Handover saved.']) {
    assert.equal(visibleMessage(null, message), '')
    assert.equal(visibleMessage({ id: 'record_1' }, message), message)
  }
  const typeSwitchedCaptureOnceMessage = (priorMessage) => visibleMessage(null, priorMessage)
  const nativeInvalidDecisionMessage = (priorMessage) => visibleMessage(null, priorMessage)
  assert.equal(typeSwitchedCaptureOnceMessage('Handover saved.'), '')
  assert.equal(nativeInvalidDecisionMessage('Decision saved.'), '')
})

test('new Handover defaults to Draft and exposes only its lifecycle statuses', () => {
  const options = attentionStatusOptions()
  const handover = createHandover({ ...base, recipientRole: 'Incoming lead' }, now)
  const markup = options('handover')
  assert.equal(handover.status, 'draft')
  assert.match(markup, /value="draft" selected/)
  for (const status of ['draft', 'ready', 'acknowledged', 'archived']) assert.match(markup, new RegExp(`value="${status}"`))
  for (const status of ['open', 'monitoring', 'resolved', 'decided', 'deferred']) assert.doesNotMatch(markup, new RegExp(`value="${status}"`))
})

test('existing Handover states and new Risk or Decision defaults remain type-specific', () => {
  const options = attentionStatusOptions()
  for (const status of ['draft', 'ready', 'acknowledged', 'archived']) assert.match(options('handover', status), new RegExp(`value="${status}" selected`))
  assert.match(options('risk'), /value="open" selected/)
  assert.match(options('decision'), /value="open" selected/)
  assert.doesNotMatch(options('risk'), /value="draft"/)
  assert.doesNotMatch(options('decision'), /value="ready"/)
})

test('type switching immediately rebuilds Status and makes Decision options visibly required', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /elements\.recordType\?\.addEventListener\('change'/)
  assert.match(source, /elements\.status\.innerHTML = attentionStatusOptions\(type\)/)
  assert.match(source, /options\.required = type === 'decision'/)
  assert.match(source, /Decision options \(required\)/)
  assert.throws(() => createDecision({ ...base, options: '' }, now), /Decision options are required/)
})

test('Needs attention form controls use a scoped uniform layout', () => {
  const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')
  assert.match(css, /#attention-form input:not\(\[type="hidden"\]\),#attention-form select \{ height:48px; min-height:48px; padding-inline:var\(--s3\); \}/)
  assert.match(css, /#attention-form textarea \{ min-height:5rem;[\s\S]*?resize:vertical;/)
  assert.match(css, /#attention-form label \{ gap:\.4rem; \}/)
  assert.match(css, /#attention-form \.field-grid \{ align-items:start; \}/)
  assert.match(css, /#attention-form \.field-grid > label \{ min-width:0; \}/)
  assert.match(css, /@media \(min-width:48rem\)[\s\S]*?\.field-grid \{ grid-template-columns:repeat\(2,minmax\(0,1fr\)\); \}/)
})
