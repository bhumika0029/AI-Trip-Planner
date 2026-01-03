import React, { useEffect, useState } from 'react';

// FREE Unsplash image (no API key)
const getLocationImage = (locationName) => {
  return `https://source.unsplash.com/1200x600/?${encodeURIComponent(
    locationName + ' travel'
  )}`;
};

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      setPhotoUrl(
        getLocationImage(trip.userSelection.location.label)
      );
    }
  }, [trip]);

  return (
    <div>
      <img
        src={photoUrl}
        alt={trip?.userSelection?.location?.label}
        className='h-[340px] w-full object-cover rounded-xl'
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
