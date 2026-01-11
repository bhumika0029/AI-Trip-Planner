import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Default image
  
  // 1. Get the Key
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  useEffect(() => {
    // Check for both 'hotelName' AND 'name' just in case AI format changes
    const nameToCheck = hotel?.hotelName || hotel?.name;

    if (nameToCheck) {
      GetUnsplashPhoto(nameToCheck);
    }
  }, [hotel]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      if (!ACCESS_KEY) {
        console.error("VITE_UNSPLASH_ACCESS_KEY is missing in .env!");
        return;
      }

      // Fetch photo specifically for hotels
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword} hotel&per_page=1&client_id=${ACCESS_KEY}`
      );

      // 👇 THE FIX: Check if the response is actually OK before parsing
      if (!response.ok) {
        console.log("Unsplash API Error: ", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.small);
      }
    } catch (error) {
      console.log("Error loading image:", error);
    }
  }

  // Get the correct name and address
  const displayName = hotel?.hotelName || hotel?.name;
  const displayAddress = hotel?.hotelAddress || hotel?.address;

  // Use Google Maps Search Link
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName + "," + displayAddress)}`;

  return (
    <Link to={googleMapsLink} target="_blank" rel="noopener noreferrer">
      <div className='hover:scale-105 transition-all cursor-pointer mt-5 mb-8 border rounded-xl p-3 shadow-md h-full bg-white flex flex-col'>
        <img
          src={photoUrl}
          alt={displayName}
          className='rounded-xl h-[180px] w-full object-cover'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className='my-2 flex flex-col gap-2'>
          <h2 className='font-medium text-lg truncate'>{displayName}</h2>
          
          <h2 className='text-xs text-gray-500 line-clamp-2'>📍 {displayAddress}</h2>
          
          <div className='flex justify-between items-center mt-auto'>
              <h2 className='text-sm font-semibold'>💰 {hotel?.price}</h2>
              <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;