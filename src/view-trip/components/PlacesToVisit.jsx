import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {

  // Helper function to sort the itinerary in case it comes as an object
  // (e.g., Day 1, Day 2 order)
  const renderItinerary = () => {
    const itinerary = trip?.tripData?.itinerary;

    // If it's an Array (perfect scenario)
    if (Array.isArray(itinerary)) {
      return itinerary.map((item, index) => (
        <div key={index} className='mt-5'>
             <h2 className='font-bold text-lg'>Day {item.day}</h2>
             <div className='grid md:grid-cols-2 gap-5'>
                {item.plan?.map((place, placeIndex) => (
                    <div key={placeIndex} className='my-2'>
                        <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                        <PlaceCardItem place={place} />
                    </div>
                ))}
             </div>
        </div>
      ));
    }

    // If it's an Object (common AI bug), convert to Array
    // This handles cases where Gemini returns { "day1": {...}, "day2": {...} }
    if (typeof itinerary === 'object' && itinerary !== null) {
        return Object.keys(itinerary).map((key, index) => {
            const item = itinerary[key];
            return (
                <div key={index} className='mt-5'>
                    <h2 className='font-bold text-lg'>Day {item.day || index + 1}</h2>
                    <div className='grid md:grid-cols-2 gap-5'>
                        {/* Sometimes 'plan' is inside, sometimes the object IS the plan */}
                        {item.plan?.map((place, placeIndex) => (
                            <div key={placeIndex} className='my-2'>
                                <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                                <PlaceCardItem place={place} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    }

    return null;
  };

  return (
    <div>
      <h2 className='font-bold text-xl'>Places to Visit</h2>
      <div>
        {renderItinerary()}
      </div>
    </div>
  );
}

export default PlacesToVisit;