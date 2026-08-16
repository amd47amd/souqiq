/**
 * Normalize Iraqi mobile numbers to local format: 07XXXXXXXXX (11 digits).
 * Accepts: 07…, 7…, +9647…, 9647…
 */
export function normalizeIraqiPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  let local = digits;
  if (local.startsWith("964")) {
    local = local.slice(3);
  }
  if (local.length === 10 && local.startsWith("7")) {
    local = `0${local}`;
  }

  if (!/^07\d{9}$/.test(local)) {
    return null;
  }

  return local;
}

export function isValidIraqiPhone(input: string): boolean {
  return normalizeIraqiPhone(input) !== null;
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizeIraqiPhone(phone) ?? phone;
  if (normalized.length === 11) {
    return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
  }
  return normalized;
}
