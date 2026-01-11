import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosSend } from "react-icons/io"; // Share Icon
import { FaMapMarkedAlt } from "react-icons/fa"; // Map Icon

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetUnsplashPhoto(trip.userSelection.location.label);
    }
  }, [trip]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&orientation=landscape&client_id=${ACCESS_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.regular);
      }
    } catch (error) {
      console.log("Error loading header image:", error);
    }
  }

  // Function to open the location in Google Maps (or OSM)
  const onMapButtonClick = () => {
    const locationName = trip?.userSelection?.location?.label;
    if (locationName) {
        // Opens Google Maps Search
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`, "_blank");
    }
  }

  // Function to Copy Trip Link to Clipboard
  const onShareButtonClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("Trip Link Copied to Clipboard!");
    });
  }

  return (
    <div>
      <img 
        src={photoUrl} 
        alt={trip?.userSelection?.location?.label}
        className='h-[340px] w-full object-cover rounded-xl'
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      <div className='flex justify-between items-center'>
        
        {/* Left Side: Text Info */}
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

        {/* Right Side: Action Buttons */}
        <div className='flex gap-2 flex-col md:flex-row'>
            <Button onClick={onShareButtonClick} variant="outline" className="h-10 w-10 md:w-auto md:px-4">
                <IoIosSend size={20} /> <span className='hidden md:inline ml-2'>Share</span>
            </Button>
            
            <Button onClick={onMapButtonClick}>
                <FaMapMarkedAlt size={20} /> <span className='hidden md:inline ml-2'>View on Map</span>
            </Button>
        </div>

      </div>
    </div>
  );
}

export default InfoSection;