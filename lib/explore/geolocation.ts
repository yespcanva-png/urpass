/**
 * UrPass Explore — Geolocation & Nearest City Detection
 * Resolves user coordinates against supported Explore marketplace cities.
 */

export interface CityCoordinates {
  name: string;
  lat: number;
  lon: number;
}

export const EXPLORE_CITY_COORDINATES: CityCoordinates[] = [
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { name: "Delhi NCR", lat: 28.6139, lon: 77.2090 },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
];

/**
 * Calculates great-circle distance between two points in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
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
 * Finds the closest Explore marketplace city for the given latitude and longitude.
 * If the closest city is within a reasonable distance (max 500 km), returns that city name.
 * Otherwise returns the closest supported city.
 */
export function findNearestExploreCity(lat: number, lon: number): string {
  let closestCity = "Bengaluru";
  let minDistance = Infinity;

  for (const city of EXPLORE_CITY_COORDINATES) {
    const dist = calculateHaversineDistanceKm(lat, lon, city.lat, city.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }

  return closestCity;
}

export interface GeolocationResult {
  success: boolean;
  city?: string;
  coords?: { latitude: number; longitude: number };
  error?: string;
}

/**
 * Browser geolocation request that resolves to the nearest Explore marketplace city.
 */
export async function autoDetectExploreCity(): Promise<GeolocationResult> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return {
      success: false,
      error: "Geolocation is not supported by your browser.",
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestExploreCity(latitude, longitude);
        resolve({
          success: true,
          city: nearestCity,
          coords: { latitude, longitude },
        });
      },
      (err) => {
        let errorMsg = "Could not detect location.";
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please select your city manually.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is currently unavailable.";
        } else if (err.code === err.TIMEOUT) {
          errorMsg = "Location request timed out. Please try again.";
        }
        resolve({
          success: false,
          error: errorMsg,
        });
      },
      {
        timeout: 8000,
        enableHighAccuracy: false,
        maximumAge: 600000, // 10 minutes cache
      }
    );
  });
}
