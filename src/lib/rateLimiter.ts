const submissionLog: Record<string, number> = {};

/**
 * Returns true if the action is allowed, false if it is rate limited.
 * @param key - A unique identifier for the action (e.g. 'inquiry-submit')
 * @param cooldownMs - Minimum milliseconds between allowed submissions (default 60000 = 1 min)
 */
export function isAllowed(key: string, cooldownMs = 60000): boolean {
  const now = Date.now();
  const last = submissionLog[key];
  if (last && now - last < cooldownMs) {
    return false;
  }
  submissionLog[key] = now;
  return true;
}
