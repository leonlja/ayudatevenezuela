export function fuzzCoord(lat: number, lng: number) {
  const meters = 20 + Math.random() * 30;
  const angle = Math.random() * Math.PI * 2;
  const deltaLat = (meters * Math.cos(angle)) / 111320;
  const deltaLng = (meters * Math.sin(angle)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return {
    lat: lat + deltaLat,
    lng: lng + deltaLng,
  };
}

// authored-by: claude-opus-4-7
