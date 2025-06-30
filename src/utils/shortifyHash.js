export const shortifyHash = (hash, length) => {
  return String(hash.slice(0, length) + "..." + hash.slice(64 - length));
};