import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Default image
  
  // 1. Get API Key from environment variables
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  useEffect(() => {
    // 2. Check for the place name (handling different naming conventions from AI)
    const queryName = place?.placeName || place?.place;
    if (queryName) {
      GetUnsplashPhoto(queryName);
    }
  }, [place]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      // 3. Use the REAL API instead of the broken 'source.unsplash.com'
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&client_id=${ACCESS_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.small);
      }
    } catch (error) {
      console.log("Error loading place image:", error);
    }
  }

  // 4. Construct the OSM Link
  const placeName = place?.placeName || place?.place;
  const osmLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(placeName)}`;

  return (
    <Link to={osmLink} target="_blank" rel="noopener noreferrer">
      <div className='shadow-sm border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 hover:shadow-md cursor-pointer transition-all bg-white'>
        <img
          src={photoUrl}
          alt={placeName}
          className='w-[130px] h-[130px] rounded-xl object-cover'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div>
          <h2 className='font-bold text-lg'>{placeName}</h2>

          <p className='text-sm text-gray-500 line-clamp-2'>
            {place?.placeDetails || place?.details}
          </p>

          <h2 className='text-xs font-medium mt-2 mb-2'>
            {/* Handle price if it exists */}
            {place?.ticketPricing || place?.ticket_pricing 
              ? `🏷️ Ticket: ${place.ticketPricing || place.ticket_pricing}` 
              : '🏷️ Ticket info not available'} 
          </h2>
          
           {/* Display travel time if available */}
           {place?.timeToTravel && (
              <h2 className='text-xs text-blue-500 font-medium'>
                 ⏱️ {place.timeToTravel}
              </h2>
           )}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;