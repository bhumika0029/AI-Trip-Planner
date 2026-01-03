import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocationImage } from '@/service/ImageService';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      setPhotoUrl(
        getLocationImage(trip.userSelection.location.label)
      );
    }
  }, [trip]);

  return (
    <Link to={`/view-trip/${trip?.id}`}>
      <div className='hover:scale-105 transition-all'>
        <img
          src={photoUrl}
          alt={trip?.userSelection?.location?.label}
          className='object-cover rounded-xl h-[220px] w-full'
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className="mt-2">
          <h2 className='font-bold text-lg'>
            {trip?.userSelection?.location?.label}
          </h2>

          <h2 className='text-sm text-gray-500'>
            {trip?.userSelection?.noOfDays} Days trip with{' '}
            {trip?.userSelection?.budget} budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
