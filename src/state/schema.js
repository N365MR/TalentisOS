export const SCHEMA_VERSION = 1;

export function createEmptyWorkspace() {
  return {
    schemaVersion: SCHEMA_VERSION,
    tasks: [],
    eod: { completed: '', outstanding: '', risks: '', handovers: '', top3: '' },
    eodHistory: [],
    kpis: [],
    issues: [],
    l10: { section: 'segue', running: false, rating: null },
    settings: { appearance: 'system', syncApi: '' }
  };
}

export function isWorkspaceSnapshot(value) {
  return Boolean(value) && typeof value === 'object'
    && value.schemaVersion === SCHEMA_VERSION
    && Array.isArray(value.tasks)
    && Array.isArray(value.eodHistory)
    && Array.isArray(value.kpis)
    && Array.isArray(value.issues)
    && typeof value.eod === 'object'
    && typeof value.l10 === 'object'
    && typeof value.settings === 'object';
}
