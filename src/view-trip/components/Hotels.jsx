import React from 'react';
import HotelCardItem from './HotelCardItem';
import { Hotel, MapPin } from 'lucide-react';

function Hotels({ trip }) {
  // Check both possible keys the AI might return
  const hotelList = trip?.tripData?.hotel_options || trip?.tripData?.hotels || [];

  return (
    <div className='my-12'>
      
      {/* --- HEADER SECTION --- */}
      <div className='mb-8'>
        <h2 className='font-bold text-2xl md:text-3xl flex items-center gap-3 text-slate-900'>
             <Hotel className="w-7 h-7 md:w-8 md:h-8 text-[#f56551]" /> 
             Hotel Recommendations
        </h2>
        {/* Shows location context dynamically */}
        <p className='text-gray-500 mt-2 text-base md:text-lg'>
             We found these top-rated places for your stay in 
             <span className='font-semibold text-[#f56551] ml-1'>
                {trip?.userSelection?.location?.label || "your destination"}
             </span>
        </p>
      </div>

      {/* --- GRID SECTION --- */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
        {hotelList?.length > 0 ? (
          hotelList.map((hotel, index) => (
            <HotelCardItem
              key={index}
              hotel={hotel}
            />
          ))
        ) : (
          
          /* --- IMPROVED EMPTY STATE --- */
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
             <MapPin className="w-12 h-12 text-gray-300 mb-3" />
             <p className="text-gray-500 font-medium text-lg">No hotel recommendations available.</p>
             <span className="text-sm text-gray-400">The AI didn't return specific hotels for this query.</span>
          </div>

        )}
      </div>
    </div>
  );
}

export default Hotels;