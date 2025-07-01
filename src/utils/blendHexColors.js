export default function blendHexColors(hex1, hex2, percentage) {
  // Ensure hex is in 6-character format
  const normalizeHex = hex => {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    return hex;
  };

  hex1 = normalizeHex(hex1);
  hex2 = normalizeHex(hex2);

  const pct = Math.min(Math.max(percentage, 0), 1); // Clamp between 0–1

  const blend = (c1, c2) => Math.round(c1 + (c2 - c1) * pct);

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = blend(r1, r2);
  const g = blend(g1, g2);
  const b = blend(b1, b2);

  const toHex = n => n.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}