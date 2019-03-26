export function keyName(key) {
  const parts = key.split('/');
  return parts[parts.length - 1];
}
