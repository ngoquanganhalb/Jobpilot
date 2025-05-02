export function cleanName(name: string) {
  return name
    .replace(/^(Thành phố|Tỉnh|Quận|Huyện|Thị xã|Thị trấn)\s+/i, "")
    .trim();
}