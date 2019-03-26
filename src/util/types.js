export function typeOf(x) {
  if (Array.isArray(x)) {
    return 'array';
  } else {
    return typeof x;
  }
}
