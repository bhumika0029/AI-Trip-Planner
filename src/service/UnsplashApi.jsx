const UNSPLASH_BASE_URL = 'https://api.unsplash.com/search/photos';
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const GetPhotoUrl = async (query) => {
  try {
    const response = await fetch(`${UNSPLASH_BASE_URL}?query=${query}&page=1&per_page=1&client_id=${ACCESS_KEY}`);
    const data = await response.json();
    
    // Return the first image found, or a placeholder if none found
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.small;
    } else {
      return '/placeholder.jpg'; // Make sure you have a placeholder.jpg in public folder
    }
  } catch (error) {
    console.error("Unsplash Error:", error);
    return '/placeholder.jpg';
  }
};