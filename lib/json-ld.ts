const BACKSLASH = String.fromCharCode(92);

/** Serialise structured data for an inline JSON-LD script. Escapes `<` (as backslash-u-0-0-3-c) so content can never close the script tag. */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, `${BACKSLASH}u003c`);
}
