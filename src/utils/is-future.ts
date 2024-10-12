export function isFuture(date: Date): boolean {
  return new Date().getTime() - date.getTime() < 0;
}
