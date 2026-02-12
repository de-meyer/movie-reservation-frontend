import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transforms image paths from the database to public URLs
 * @param imagePath - The image path from the database (e.g., "breaking_bread-profile.jpg")
 * @param type - The type of image: 'landscape' or 'profile' (used as fallback)
 * @returns The full public URL path
 */
export function getImageUrl(imagePath: string | undefined, type: 'landscape' | 'profile'): string {
  if (!imagePath) {
    // Return a placeholder image if no path is provided
    return `/placeholder-${type}.jpg`;
  }
  
  // If the path already starts with /landscape or /profile or is a full URL, return as is
  if (imagePath.startsWith('/landscape/') || imagePath.startsWith('/profile/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Detect type from filename if it includes -profile or -landscape suffix
  if (imagePath.includes('-profile.')) {
    return `/profile/${imagePath}`;
  }
  
  if (imagePath.includes('-landscape.')) {
    return `/landscape/${imagePath}`;
  }
  
  // Otherwise, use the provided type parameter as fallback
  return `/${type}/${imagePath}`;
}
