import React, { useEffect, useState } from 'react';
// We don't need the broken 'getLocationImage' function anymore

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Default image
  
  // 1. Get the API Key
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetUnsplashPhoto(trip.userSelection.location.label);
    }
  }, [trip]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      // 2. Fetch the image using the API Key
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&orientation=landscape&client_id=${ACCESS_KEY}`
      );
      const data = await response.json();
      
      // 3. Set the image URL if found
      if (data.results && data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.regular);
      }
    } catch (error) {
      console.log("Error loading header image:", error);
    }
  }

  return (
    <div>
      <img 
        src={photoUrl} 
        alt={trip?.userSelection?.location?.label}
        className='h-[340px] w-full object-cover rounded-xl'
        // Fallback if the image link breaks
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      <div className='my-5 flex flex-col gap-2'>
        <h2 className='font-bold text-2xl'>
          {trip?.userSelection?.location?.label}
        </h2>

        <div className='flex gap-5 flex-wrap'>
          <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
            📅 {trip?.userSelection?.noOfDays} Day(s)
          </h2>

          <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
            💰 {trip?.userSelection?.budget} Budget
          </h2>

          <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
            👥 Travelers: {trip?.userSelection?.traveler}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;