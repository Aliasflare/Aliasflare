export function validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

export function validateUsername(username: string) {
  return /^[a-zA-Z0-9_]+$/.test(username);
}

export function validateUUID(uuid: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

export function validateMailName(name: string): boolean {
  if (typeof name !== 'string') return false;
  if (name.length === 0 || name.length > 64) return false;

  // Must not contain control characters (ASCII < 32 or 127)
  const controlCharRegex = /[\x00-\x1F\x7F]/;
  if (controlCharRegex.test(name)) return false;

  // Dangling backslash is invalid (e.g. ends with single \)
  if (/\\$/.test(name)) return false;

  // Unescaped quote count must be even (for escapability)
  const unescapedQuoteRegex = /(?<!\\)"/g;
  const quotes = name.match(unescapedQuoteRegex);
  if (quotes && quotes.length % 2 !== 0) return false;

  return true;
}