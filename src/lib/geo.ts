import type { Outlet } from "@/lib/types";

/** Convert degrees to radians. */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance between two lat/lng points in kilometers. */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Find the outlet closest to the given coordinates. */
export function findNearestOutlet(
  lat: number,
  lng: number,
  outlets: Outlet[]
): Outlet | null {
  if (!outlets.length) return null;
  let nearest = outlets[0];
  let minDistance = Infinity;
  for (const outlet of outlets) {
    const distance = haversineDistance(lat, lng, outlet.lat, outlet.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = outlet;
    }
  }
  return nearest;
}

/** Promise wrapper around the browser geolocation API. */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
}
