import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// FREE image source (no API key)
const getHotelImage = (name) => {
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(
    name + ' hotel'
  )}`;
};

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    if (hotel?.name) {
      setPhotoUrl(getHotelImage(hotel.name));
    }
  }, [hotel]);

  // OpenStreetMap search link (FREE)
  const osmLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    hotel?.name + ' ' + hotel?.address
  )}`;

  return (
    <Link to={osmLink} target="_blank" rel="noopener noreferrer">
      <div className='hover:scale-110 transition-all cursor-pointer mt-5 mb-8'>
        <img
          src={photoUrl}
          alt={hotel?.name}
          className='rounded-xl h-[180px] w-full object-cover'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className='my-2'>
          <h2 className='font-medium'>{hotel?.name}</h2>
          <h2 className='text-xs text-gray-500'>📍 {hotel?.address}</h2>
          <h2 className='text-sm'>💰 {hotel?.price}</h2>
          <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
