import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react'; // Ensure you have lucide-react installed

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(null); // Start null to show loading state
  const [loadingImage, setLoadingImage] = useState(true);
  
  // 1. Get the Key
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

  const displayName = hotel?.hotelName || hotel?.name;
  const displayAddress = hotel?.hotelAddress || hotel?.address;

  useEffect(() => {
    if (displayName) {
      GetUnsplashPhoto(displayName);
    }
  }, [hotel]);

  const GetUnsplashPhoto = async (keyword) => {
    try {
      if (!ACCESS_KEY) return;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword} hotel luxury&per_page=1&client_id=${ACCESS_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results?.length > 0) {
          setPhotoUrl(data.results[0].urls.small);
        }
      }
    } catch (error) {
      console.log("Error loading image:", error);
    } finally {
        setLoadingImage(false);
    }
  }

  // ✅ FIXED: Correct Google Maps Search Link
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName + "," + displayAddress)}`;

  return (
    <Link to={googleMapsLink} target="_blank" rel="noopener noreferrer" className='block h-full'>
      <div className='group h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col'>
        
        {/* --- IMAGE SECTION --- */}
        <div className='relative h-[200px] w-full bg-gray-100 overflow-hidden'>
             {loadingImage ? (
                // 💀 Skeleton Loader
                <div className="w-full h-full bg-slate-200 animate-pulse" />
             ) : (
                <img
                    src={photoUrl || '/placeholder.jpg'}
                    alt={displayName}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
             )}
             
             {/* Rating Badge (Floating) */}
             {hotel?.rating && (
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {hotel?.rating}
                 </div>
             )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className='p-4 flex flex-col flex-grow gap-3'>
          
          <div className='flex-grow'>
             <h2 className='font-bold text-lg leading-tight text-slate-800 mb-1 line-clamp-1'>
                {displayName}
             </h2>
             <p className='text-sm text-gray-500 flex items-start gap-1 line-clamp-2'>
                <MapPin className="w-4 h-4 text-[#f56551] shrink-0 mt-0.5" /> 
                {displayAddress}
             </p>
          </div>
          
          {/* Price Section */}
          <div className='pt-3 border-t border-gray-100 flex items-center justify-between mt-auto'>
              <div className='flex flex-col'>
                  <span className='text-xs text-gray-400'>Price per night</span>
                  <span className='font-semibold text-base text-slate-900'>
                     {hotel?.price ? `💰 ${hotel.price}` : 'Check availability'}
                  </span>
              </div>
              
              <div className="px-3 py-1.5 bg-orange-50 text-[#f56551] text-xs font-medium rounded-full group-hover:bg-[#f56551] group-hover:text-white transition-colors">
                  View Map ↗
              </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;