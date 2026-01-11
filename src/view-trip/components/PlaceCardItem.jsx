import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); 
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  useEffect(() => {
    const queryName = place?.placeName || place?.place;
    if (queryName) {
      GetUnsplashPhoto(queryName);
    }
  }, [place]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      if (!ACCESS_KEY) {
        console.error("Unsplash Key missing!");
        return;
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&client_id=${ACCESS_KEY}`
      );

      // 👇 FIX 1: Check if response is OK before parsing
      if (!response.ok) {
        console.log("Unsplash API Error:", response.status, response.statusText);
        return; 
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.small);
      }
    } catch (error) {
      console.log("Error loading place image:", error);
    }
  }

  // 👇 FIX 2: Corrected Google Maps URL syntax
  const placeName = place?.placeName || place?.place;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

  return (
    <Link to={mapLink} target="_blank" rel="noopener noreferrer">
      <div className='shadow-sm border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 hover:shadow-md cursor-pointer transition-all bg-white h-full'>
        <img
          src={photoUrl}
          alt={placeName}
          className='w-[130px] h-[130px] rounded-xl object-cover min-w-[130px]'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className='flex flex-col gap-2'>
          <h2 className='font-bold text-lg'>{placeName}</h2>

          <p className='text-sm text-gray-500 line-clamp-2'>
            {place?.placeDetails || place?.details}
          </p>

          <div className='flex flex-wrap gap-2 items-center'>
             {/* Ticket Info */}
             { (place?.ticketPricing || place?.ticket_pricing) &&
               <h2 className='text-xs bg-gray-100 p-1 rounded px-2'>
                  🎟️ {place.ticketPricing || place.ticket_pricing}
               </h2>
             }
             
             {/* Travel Time */}
             { place?.timeToTravel && (
               <h2 className='text-xs bg-gray-100 p-1 rounded px-2 text-blue-600 font-medium'>
                  ⏱️ {place.timeToTravel}
               </h2>
             )}

             {/* Map Button indicator */}
             <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                 <FaMapLocationDot className="mr-1"/> Map
             </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;