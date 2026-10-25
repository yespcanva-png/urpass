import { EXPLORE_CITIES, type ExploreCity } from "./types";

interface CityCoordinates {
  city: ExploreCity;
  lat: number;
  lng: number;
}

// Known coordinates for supported explore cities
export const CITY_COORDINATES: CityCoordinates[] = [
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi NCR", lat: 28.6139, lng: 77.2090 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { city: "London", lat: 51.5074, lng: -0.1278 },
];

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Match given coordinates to the closest supported explore city
 */
export function findClosestExploreCity(
  lat: number,
  lng: number,
  maxDistanceKm = 350
): { city: ExploreCity; distanceKm: number } | null {
  let closest: { city: ExploreCity; distanceKm: number } | null = null;

  for (const item of CITY_COORDINATES) {
    const distanceKm = calculateHaversineDistanceKm(lat, lng, item.lat, item.lng);
    if (!closest || distanceKm < closest.distanceKm) {
      closest = { city: item.city, distanceKm };
    }
  }

  if (closest && closest.distanceKm <= maxDistanceKm) {
    return closest;
  }

  return closest;
}

/**
 * Auto-detect user's city via Browser Geolocation API with fallback to IP-based /api/geo
 */
export async function detectUserCity(): Promise<{
  city: ExploreCity;
  method: "gps" | "ip" | "fallback";
  distanceKm?: number;
}> {
  // 1. Try Browser GPS Geolocation API
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 6000,
          maximumAge: 300000, // 5 min cache
        });
      });

      const { latitude, longitude } = position.coords;
      const match = findClosestExploreCity(latitude, longitude, 350);

      if (match) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("urpass_detected_city", match.city);
          } catch {}
        }
        return {
          city: match.city,
          method: "gps",
          distanceKm: Math.round(match.distanceKm),
        };
      }
    } catch {
      // Geolocation denied or timed out; fallback to IP detection
    }
  }

  // 2. Fallback to server IP detection
  try {
    const res = await fetch("/api/geo");
    if (res.ok) {
      const data = await res.json();
      if (data.isUk) {
        return { city: "London", method: "ip" };
      }
      if (data.city) {
        const normalized = data.city.toLowerCase();
        const matched = EXPLORE_CITIES.find(
          (c) => c.toLowerCase() === normalized || normalized.includes(c.toLowerCase())
        );
        if (matched && matched !== "All Cities") {
          return { city: matched, method: "ip" };
        }
      }
      if (data.isIndia) {
        return { city: "Bengaluru", method: "ip" };
      }
    }
  } catch {}

  return { city: "All Cities", method: "fallback" };
}
