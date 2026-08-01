export const EXPORT_FORMAT_VERSION = 1;
export const APPLICATION_VERSION = '0.1.0';

export const BACKUP_COLLECTIONS = [
  'settings',
  'dailyPlans',
  'priorities',
  'huddles',
  'workItems',
  'risks',
  'decisions',
  'followUps',
  'dailyReviews',
  'tomorrowPlans',
  'weeklyReviews',
  'improvements',
  'savedPlaybookTopics',
  'onboardingState',
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeImportedValue(value) {
  if (typeof value === 'string') {
    return Array.from(value.replace(/[<>]/g, ''))
      .filter((character) => {
        const code = character.charCodeAt(0);
        return !(code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31));
      })
      .join('')
      .slice(0, 20000);
  }
  if (Array.isArray(value)) return value.map(sanitizeImportedValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeImportedValue(child)]));
  }
  return value;
}

export function createBackup(data, exportedAt = new Date().toISOString()) {
  return {
    format: 'TalentisOS workspace backup',
    exportVersion: EXPORT_FORMAT_VERSION,
    applicationVersion: APPLICATION_VERSION,
    exportedAt,
    data: Object.fromEntries(
      BACKUP_COLLECTIONS.map((collection) => [collection, sanitizeImportedValue(data[collection] || [])]),
    ),
  };
}

export function migrateBackup(input) {
  if (!input || typeof input !== 'object') throw new Error('The selected file is not a JSON object.');
  if (input.format === 'TalentisOS workspace backup' && input.exportVersion === EXPORT_FORMAT_VERSION) return sanitizeImportedValue(input);
  if (input.format === 'TalentisOS workspace backup' && input.exportVersion === 0 && input.data) {
    return createBackup(input.data, input.exportedAt || new Date().toISOString());
  }
  throw new Error('Unsupported TalentisOS backup format or export version.');
}

export function validateBackup(input) {
  const backup = migrateBackup(input);
  if (!backup.exportedAt || Number.isNaN(Date.parse(backup.exportedAt))) throw new Error('Backup export date is invalid.');
  for (const collection of BACKUP_COLLECTIONS) {
    if (!Array.isArray(backup.data[collection])) throw new Error(`Backup collection “${collection}” must be an array.`);
  }
  return backup;
}

export function backupCounts(backup) {
  return Object.fromEntries(BACKUP_COLLECTIONS.map((collection) => [collection, backup.data[collection]?.length || 0]));
}

export function restoreCollections(backup) {
  const data = backup.data;
  const workItems = data.workItems?.length ? data.workItems : [...(data.risks || []), ...(data.decisions || []), ...(data.followUps || [])];
  return {
    settings: data.settings,
    dailyPlans: data.dailyPlans,
    priorities: data.priorities,
    workItems,
    dailyReviews: data.dailyReviews,
    tomorrowPlans: data.tomorrowPlans,
    weeklyReviews: data.weeklyReviews,
    improvements: data.improvements,
    playbookState: [{ id: 'primary', savedTopicIds: data.savedPlaybookTopics || [], recentTopicIds: [] }],
    appMeta: data.onboardingState || [],
  };
}

export function csvEscape(value) {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function createCsv(rows, columns) {
  return [columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((line) => line.map(csvEscape).join(','))
    .join('\r\n') + '\r\n';
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (quoted && character === '"' && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && character === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && (character === '\n' || character === '\r')) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return { headers: [], rows: [] };
  const headers = rows.shift().map((header) => header.trim());
  return { headers, rows: rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))) };
}

const csvSchemas = {
  priorities: { required: ['outcome', 'planDate'], columns: ['id', 'planDate', 'outcome', 'why', 'duePoint', 'status', 'order'] },
  risks: { required: ['title', 'planDate'], columns: ['id', 'planDate', 'title', 'whatAtRisk', 'impact', 'immediateAction', 'dueDate', 'status', 'riskLevel'] },
  decisions: { required: ['title', 'planDate'], columns: ['id', 'planDate', 'title', 'decisionRequired', 'decisionMade', 'resultingAction', 'dueDate', 'status'] },
  followUps: { required: ['title', 'dueDate'], columns: ['id', 'title', 'responsible', 'dueDate', 'nextAction', 'status', 'followedUpWith'] },
  improvements: { required: ['notWorking', 'change'], columns: ['id', 'notWorking', 'change', 'why', 'nextStep', 'category', 'status', 'createdAt'] },
};

export function csvSchema(type) {
  const schema = csvSchemas[type];
  if (!schema) throw new Error(`CSV type “${type}” is not supported.`);
  return schema;
}

export function validateCsv(type, parsed) {
  const schema = csvSchema(type);
  const missing = schema.required.filter((column) => !parsed.headers.includes(column));
  if (missing.length) throw new Error(`Missing required column(s): ${missing.join(', ')}.`);
  const errors = [];
  const records = parsed.rows.map((row, index) => {
    const rowNumber = index + 2;
    for (const column of schema.required) if (!row[column]?.trim()) errors.push(`Row ${rowNumber}: ${column} is required.`);
    for (const column of ['planDate', 'dueDate', 'createdAt']) {
      if (row[column] && (column === 'createdAt' ? Number.isNaN(Date.parse(row[column])) : !datePattern.test(row[column]) || Number.isNaN(Date.parse(`${row[column]}T12:00:00`)))) errors.push(`Row ${rowNumber}: ${column} is not a valid date.`);
    }
    return sanitizeImportedValue(row);
  });
  return { records, errors };
}

export function csvTemplate(type) {
  const schema = csvSchema(type);
  return createCsv([], schema.columns);
}
