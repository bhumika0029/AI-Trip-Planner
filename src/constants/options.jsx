export const SelectTravelList = [
    {
        id:1,
        title: 'Just Me',
        desc: 'A sole traveles in exploration',
        icon: '✈️',
        people:'1 person'
    },
    {
        id:2,
        title: 'A Couple',
        desc: 'Two traveles in tandem',
        icon: '🥂',
        people:'2 people'
    },
    {
        id:3,
        title: 'Family',
        desc: 'A group of fun loving adv',
        icon: '🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekes',
        icon: '⛵',
        people:'5 to 10 people'
    }
]

export const SelectBudgetOptions = [
    {
        id:1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💰',
    },
    {
        id:3,
        title: 'Luxury',
        desc: 'Dont worry about cost',
        icon: '💸',
    }
]

// --- ✨ NEW FEATURE: Travel Styles ---
export const SelectInterestList = [
    { id: 1, title: 'Adventure', icon: '🧗', desc: 'Hiking, Thrills' },
    { id: 2, title: 'Relaxing', icon: '🛁', desc: 'Spa, Beach' },
    { id: 3, title: 'Cultural', icon: '🏛️', desc: 'History, Art' },
    { id: 4, title: 'Foodie', icon: '🌮', desc: 'Local Cuisine' },
    { id: 5, title: 'Nightlife', icon: '🍸', desc: 'Clubs, Bars' },
];

// --- ✨ NEW FEATURE: Dietary Options ---
export const DietaryOptions = ["None", "Vegetarian", "Vegan", "Halal", "Gluten-Free", "Nut-Free"];

// --- ✨ UPDATED AI PROMPT ---
// I added {interests} and {diet} to this string so the AI actually uses them.
export const AI_PROMPT = `
Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget.
The traveler is interested in {interests} activities and has the following dietary restriction: {diet}.

Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and 
suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.
`;