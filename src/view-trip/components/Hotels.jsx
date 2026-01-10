import React from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  // Check both possible keys the AI might return
  const hotelList = trip?.tripData?.hotel_options || trip?.tripData?.hotels || [];

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {hotelList?.length > 0 ? (
          hotelList.map((hotel, index) => (
            <HotelCardItem
              key={index}
              hotel={hotel}
            />
          ))
        ) : (
          // Optional: Show a message if no hotels are found
          <p className="text-gray-500 mt-5">No hotel recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default Hotels;