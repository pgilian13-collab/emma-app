export function cn(...inputs: Array<string | number | boolean | null | undefined>): string {
  return inputs.filter(Boolean).map(String).join(' ').trim();
}