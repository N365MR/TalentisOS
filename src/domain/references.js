export function findTaskReferences(records, taskId) {
  return records.flatMap((record) => (record.typedLinks || []).filter((link) => link.recordType === 'task' && link.recordId === taskId).map((link) => ({ sourceId: record.id, sourceTitle: record.title || null, sourceType: record.recordType, relationship: link.relationship })))
}

export function taskDeletionConfirmation(references) {
  if (!references.length) return 'This task has no linked records.\n\nPermanent deletion cannot be undone. Continue?'
  const heading = `This will repair ${references.length} linked task reference${references.length === 1 ? '' : 's'}:`
  const entries = references.map((reference) => `• ${reference.sourceTitle || 'Untitled task'} (${reference.sourceId}) — ${reference.relationship}`)
  return `${heading}\n${entries.join('\n')}\n\nPermanent deletion cannot be undone. Continue?`
}

export function repairTaskReferences(records, taskId, replacementTaskId = null) {
  return records.map((record) => ({ ...record, typedLinks: (record.typedLinks || []).flatMap((link) => {
    if (link.recordType !== 'task' || link.recordId !== taskId) return [link]
    return replacementTaskId ? [{ ...link, recordId: replacementTaskId }] : []
  }) }))
}
