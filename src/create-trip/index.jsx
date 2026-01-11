import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  AI_PROMPT, 
  SelectBudgetOptions, 
  SelectTravelList, 
  SelectInterestList, // 👈 Imported
  DietaryOptions      // 👈 Imported
} from '@/constants/options';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Wallet, Users, Sparkles, Utensils, Plane } from 'lucide-react';

function CreateTrip() {
  const [formData, setFormData] = useState({
      interests: [], 
      diet: 'None'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing AI...");

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
      let current = formData.interests || [];
      if (current.includes(interest)) {
          current = current.filter(i => i !== interest);
      } else {
          if (current.length >= 3) {
            toast.warning("You can select up to 3 interests.");
            return;
          }
          current.push(interest);
      }
      setFormData(prev => ({ ...prev, interests: current }));
  };

  const searchLocation = async (value) => {
    setSearchText(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        const data = await res.json();
        setSuggestions(data);
    } catch (error) {
        console.error("Error fetching location:", error);
    }
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast.error('Please fill in the required details.');
      return;
    }
    
    if (formData.noOfDays > 10) {
      toast.warning('Please select fewer than 10 days.');
      return;
    }

    setLoading(true);
    setLoadingText("Constructing your itinerary...");

    const interestsStr = formData.interests?.length > 0 ? formData.interests.join(", ") : "General Sightseeing";
    const dietStr = formData.diet || "None";

    // ✨ CLEANER PROMPT REPLACEMENT logic now that AI_PROMPT has placeholders
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget)
      .replace('{interests}', interestsStr)
      .replace('{diet}', dietStr);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      let responseText = await result.response.text();
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      saveTrip(responseText); 

    } catch (error) {
      console.error("Error generating trip:", error);
      if (error.message.includes("429")) {
          toast.error("High traffic! Please wait 1 minute before trying again.");
      } else {
          toast.error("Failed to generate trip. Please try again.");
      }
      setLoading(false);
    } 
  };

  const saveTrip = async (TripData) => {
    setLoadingText("Saving your adventure...");
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      let parsedTripData;
      
      try {
        parsedTripData = JSON.parse(TripData);
      } catch (e) {
        console.error("JSON Parsing Error:", e);
        toast.error("AI response error. Please regenerate.");
        setLoading(false);
        return; 
      }

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user.email,
        id: docId,
        createdAt: new Date().toISOString()
      });

      setLoading(false); 
      navigate('/view-trip/' + docId);
      
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Database error.");
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (res) => getUserProfile(res),
    onError: (error) => console.log(error)
  });

  const getUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
        headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' },
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    });
  };

  return (
    <div className='max-w-4xl mx-auto px-5 mt-12 mb-20'>
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className='font-extrabold text-4xl md:text-5xl text-slate-900 leading-tight'>
           Design Your Dream <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#f56551] to-orange-400'>Adventure</span> 🏕️
        </h2>
        <p className='mt-4 text-gray-500 text-lg md:text-xl max-w-2xl mx-auto'>
          Tell us what you love, and our AI will craft a personalized day-by-day itinerary just for you.
        </p>
      </motion.div>

      <div className='flex flex-col gap-12'>

        {/* 1. DESTINATION & DAYS */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            <div className='space-y-3'>
                <h2 className='text-lg font-semibold flex items-center gap-2'><MapPin className="text-[#f56551]" /> Where to?</h2>
                <div className="relative">
                    <Input
                    placeholder="Search destination (Paris, Tokyo, New York)"
                    value={searchText}
                    onChange={(e) => searchLocation(e.target.value)}
                    className="h-12 text-lg border-gray-300 focus:border-[#f56551] focus:ring-[#f56551]"
                    />
                    {suggestions.length > 0 && (
                    <div className="absolute bg-white border border-gray-100 w-full z-50 rounded-xl shadow-2xl max-h-[250px] overflow-y-auto mt-2">
                        {suggestions.map((item, index) => (
                        <div
                            key={index} 
                            className="p-3 hover:bg-orange-50 cursor-pointer text-sm border-b last:border-0 border-gray-100 flex items-center gap-2"
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
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {item.display_name}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>

            <div className='space-y-3'>
                <h2 className='text-lg font-semibold flex items-center gap-2'><Calendar className="text-[#f56551]" /> How many days?</h2>
                <Input
                    type="number"
                    placeholder="Ex. 3"
                    max={10}
                    min={1}
                    className="h-12 text-lg border-gray-300 focus:border-[#f56551]"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                />
            </div>
        </motion.div>

        {/* 2. INTERESTS (TRAVEL STYLE) */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'><Sparkles className="text-[#f56551]" /> Travel Style (Select up to 3)</h2>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            {SelectInterestList.map((item, index) => (
                <div
                key={index}
                onClick={() => handleInterestToggle(item.title)}
                className={`p-3 border rounded-xl cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 h-32
                    ${formData.interests?.includes(item.title) 
                        ? 'border-[#f56551] bg-orange-50 ring-1 ring-[#f56551]' 
                        : 'border-gray-200 bg-white'}`} 
                >
                <div className='text-3xl'>{item.icon}</div>
                <h2 className='font-medium text-sm'>{item.title}</h2>
                </div>
            ))}
            </div>
        </motion.div>

        {/* 3. BUDGET & TRAVELERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='space-y-4'
            >
                <h2 className='text-lg font-semibold flex items-center gap-2'><Wallet className="text-[#f56551]" /> Budget</h2>
                <div className='grid grid-cols-3 gap-4'>
                    {SelectBudgetOptions.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleInputChange('budget', item.title)}
                        className={`p-4 border rounded-xl cursor-pointer hover:scale-105 transition-all
                        ${formData.budget === item.title ? 'border-[#f56551] shadow-lg bg-orange-50' : 'border-gray-200'}`} 
                    >
                        <h2 className='text-3xl mb-2'>{item.icon}</h2>
                        <h2 className='font-bold text-sm'>{item.title}</h2>
                    </div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='space-y-4'
            >
                <h2 className='text-lg font-semibold flex items-center gap-2'><Users className="text-[#f56551]" /> Companions</h2>
                <div className='grid grid-cols-3 gap-4'>
                    {SelectTravelList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleInputChange('traveler', item.people)}
                        className={`p-4 border rounded-xl cursor-pointer hover:scale-105 transition-all
                        ${formData.traveler === item.people ? 'border-[#f56551] shadow-lg bg-orange-50' : 'border-gray-200'}`}
                    >
                        <h2 className='text-3xl mb-2'>{item.icon}</h2>
                        <h2 className='font-bold text-sm'>{item.title}</h2>
                    </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* 4. DIETARY PREFERENCES */}
        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className='space-y-3'
        >
             <h2 className='text-lg font-semibold flex items-center gap-2'><Utensils className="text-[#f56551]" /> Dietary Restrictions (Optional)</h2>
             <div className="flex gap-2 flex-wrap">
                {DietaryOptions.map((option, idx) => (
                    <div 
                        key={idx}
                        onClick={() => handleInputChange('diet', option)}
                        className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors
                            ${formData.diet === option ? 'bg-black text-white border-black' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                    >
                        {option}
                    </div>
                ))}
             </div>
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className='my-16 flex justify-end'
      >
        <Button 
            onClick={onGenerateTrip} 
            disabled={loading} 
            className="w-full h-14 text-lg bg-gradient-to-r from-[#f56551] to-orange-500 hover:from-[#e05845] hover:to-orange-600 shadow-xl rounded-xl transition-all hover:scale-[1.02]"
        >
          {loading ? 'Processing...' : 'Generate My Trip 🚀'}
        </Button>
      </motion.div>

      {/* --- FULL SCREEN LOADING OVERLAY --- */}
      <AnimatePresence>
        {loading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Plane className="w-16 h-16 text-[#f56551]" />
                </motion.div>
                <h2 className="text-2xl font-bold mt-5 text-gray-800">{loadingText}</h2>
                <p className="text-gray-500 mt-2">Our AI is finding the best spots for you...</p>
            </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="visibly-hidden">Sign In</DialogTitle>
            <DialogDescription className="text-center pt-5">
                <img src="/logo.svg" alt="logo" className="w-20 mx-auto mb-5" />
                <h2 className="font-bold text-xl text-gray-900">Sign In to Continue</h2>
                <p className="text-gray-500 mt-2 mb-6">Save your trips and access them from any device.</p>
                <Button onClick={login} className="w-full flex gap-3 h-12 text-md">
                  <FcGoogle className="h-6 w-6" /> Sign in with Google
                </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;