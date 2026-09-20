const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function createStableId(prefix = 'rec') {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  return `${prefix}_${random}`
}

export function validateTimezone(timezone) {
  try { Intl.DateTimeFormat(undefined, { timeZone: timezone }); return timezone } catch { throw new Error('Choose a recognised IANA timezone, such as Australia/Melbourne.') }
}

export function isDateOnly(value) { return value === null || value === '' || (typeof value === 'string' && DATE_PATTERN.test(value)) }

export function dateInTimezone(instant, timezone) {
  validateTimezone(timezone)
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(instant))
  const read = (type) => parts.find((part) => part.type === type).value
  return `${read('year')}-${read('month')}-${read('day')}`
}

export function nextWorkday(date, timezone = 'UTC') {
  if (!isDateOnly(date) || !date) throw new Error('A valid YYYY-MM-DD date is required.')
  validateTimezone(timezone)
  const point = new Date(`${date}T12:00:00Z`)
  const day = point.getUTCDay()
  point.setUTCDate(point.getUTCDate() + (day >= 5 ? 8 - day : 1))
  return point.toISOString().slice(0, 10)
}

export function confirmationRequired({ linkedRecordCount = 0, material = false } = {}) { return material || linkedRecordCount > 0 }
