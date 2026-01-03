import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // OSM search
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const searchLocation = async (value) => {
    setSearchText(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast('Please fill all details');
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    setLoading(false);

    saveTrip(result.response.text());
  };

  const saveTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user.email,
      id: docId
    });

    navigate('/view-trip/' + docId);
  };

  const login = useGoogleLogin({
    onSuccess: (res) => getUserProfile(res),
    onError: (error) => console.log(error)
  });

  const getUserProfile = (tokenInfo) => {
    axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: 'application/json',
        },
      }
    ).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    });
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>

      <div className='mt-10 flex flex-col gap-10'>

        {/* Destination */}
        <div>
          <h2 className='text-xl font-medium mb-2'>Destination</h2>
          <div className="relative">
            <Input
              placeholder="Search destination (Paris, Goa, Tokyo)"
              value={searchText}
              onChange={(e) => searchLocation(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white border w-full z-50 rounded-md">
                {suggestions.map(item => (
                  <div
                    key={item.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchText(item.display_name);
                      setSuggestions([]);
                      handleInputChange('location', {
                        label: item.display_name,
                        lat: item.lat,
                        lon: item.lon,
                      });
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Days */}
        <div>
          <h2 className='text-xl font-medium mb-2'>Days</h2>
          <Input
            type="number"
            placeholder="Ex. 4"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className='text-xl font-medium mb-2'>Budget</h2>
          <div className='grid grid-cols-3 gap-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border rounded-lg cursor-pointer
                  ${formData.budget === item.title && 'border-black shadow-md'}`}
              >
                <h2 className='text-3xl'>{item.icon}</h2>
                <h2 className='font-bold'>{item.title}</h2>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <h2 className='text-xl font-medium mb-2'>Travelers</h2>
          <div className='grid grid-cols-3 gap-5'>
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border rounded-lg cursor-pointer
                  ${formData.traveler === item.people && 'border-black shadow-md'}`}
              >
                <h2 className='text-3xl'>{item.icon}</h2>
                <h2 className='font-bold'>{item.title}</h2>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className='my-10 flex justify-end'>
        <Button onClick={onGenerateTrip} disabled={loading}>
          {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : 'Generate Trip'}
        </Button>
      </div>

      {/* Login dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <Button onClick={login} className="w-full flex gap-3">
                <FcGoogle /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
