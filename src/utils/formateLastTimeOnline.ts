export function formatLastTimeOnline(lastTimeOnline: string) {
  const date = new Date(lastTimeOnline);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}
