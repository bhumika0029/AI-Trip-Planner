import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Map } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/');
      return;
    }

    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'AITrips'),
        where('userEmail', '==', user.email)
      );

      const querySnapshot = await getDocs(q);
      const trips = [];

      querySnapshot.forEach((doc) => {
        // IMPORTANT: We include the doc.id so we can delete it later
        trips.push({ ...doc.data(), id: doc.id });
      });

      // Sort by newest first (optional)
      // trips.sort((a, b) => b.id - a.id); 

      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      // 1. Delete from Firebase
      await deleteDoc(doc(db, "AITrips", tripId));
      
      // 2. Remove from screen instantly (Optimistic UI update)
      setUserTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip.");
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 px-5 mt-10 mb-20'>
      
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-3xl'>My Trips</h2>
        <Link to="/create-trip">
            <Button className="bg-[#f56551] hover:bg-[#d6503d]">+ Create New Trip</Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
        {/* LOADING STATE */}
        {isLoading ? (
             [1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className='h-[250px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
             ))
        ) : userTrips.length > 0 ? (
          
          /* TRIP LIST */
          userTrips.map((trip, index) => (
            <div key={index} className="relative group">
                
                {/* The Trip Card */}
                <UserTripCardItem trip={trip} />

                {/* DELETE BUTTON - Visible on Hover */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-10"
                        title="Delete Trip"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" /> Delete this trip?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove the trip to 
                        <strong> {trip?.userSelection?.location?.label}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

            </div>
          ))
        ) : (
          
          /* EMPTY STATE */
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-5">
              <div className="bg-slate-100 p-6 rounded-full">
                  <Map className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">No trips created yet!</h2>
                <p className="text-gray-500 mt-2">Time to plan your next big adventure.</p>
              </div>
              <Link to="/create-trip">
                 <Button>Plan a Trip Now 🚀</Button>
              </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;