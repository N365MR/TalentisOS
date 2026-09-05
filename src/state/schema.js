export const SCHEMA_VERSION = 1;

export function createMetadataRecord(now = new Date().toISOString()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    initializedAt: now
  };
}

export function isMetadataRecord(value) {
  return Boolean(value) && typeof value === 'object'
    && value.schemaVersion === SCHEMA_VERSION
    && typeof value.initializedAt === 'string';
}
