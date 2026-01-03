import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// FREE Unsplash image (no API key)
const getPlaceImage = (placeName) => {
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(
    placeName + ' tourist place'
  )}`;
};

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    if (place?.place) {
      setPhotoUrl(getPlaceImage(place.place));
    }
  }, [place]);

  // OpenStreetMap search link (FREE)
  const osmLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    place?.place
  )}`;

  return (
    <Link to={osmLink} target="_blank" rel="noopener noreferrer">
      <div className='shadow-sm border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
        <img
          src={photoUrl}
          alt={place?.place}
          className='w-[130px] h-[130px] rounded-xl object-cover'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div>
          <h2 className='font-bold text-lg'>{place?.place}</h2>

          <p className='text-sm text-gray-500'>
            {place?.details}
          </p>

          <h2 className='text-xs font-medium mt-2 mb-2'>
            🏷️ Ticket: {place?.ticket_pricing}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
