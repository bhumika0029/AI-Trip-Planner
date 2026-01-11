import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Header() {
  // 1. Initialize State from LocalStorage (Lazy initialization)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);
  
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error)
  })

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json',
      },
    }).then((resp) => {
      console.log(resp);
      
      // 2. Save to Storage AND State
      localStorage.setItem('user', JSON.stringify(resp.data));
      setUser(resp.data); // This triggers the UI update immediately
      setOpenDialog(false);
      
      // No window.location.reload() needed!
    }).catch((error) => {
      console.error("Error fetching user profile: ", error);
    });
  }

  const handleLogout = () => {
      googleLogout();
      localStorage.clear();
      setUser(null); // Clears the user from state immediately
      navigate("/"); // Smooth React Router navigation
  };

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <Link to={'/'} className='flex items-center gap-2'>
        <img src="/logo.svg" alt="Logo" />
      </Link>
      
      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            
            <Link to="/create-trip">
              <Button variant="outline" className="rounded-full">+ Create Trip</Button>
            </Link>
            
            <Link to="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </Link>

            <Popover>
              <PopoverTrigger className='bg-transparent p-0 border-none outline-none'>            
                <img 
                    src={user?.picture} 
                    alt="user profile" 
                    className='h-[35px] w-[35px] rounded-full object-cover' 
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 
                    className='cursor-pointer font-medium text-red-500 hover:bg-slate-100 p-2 rounded' 
                    onClick={handleLogout}
                >
                    Logout
                </h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
            <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            {/* Added DialogTitle for Accessibility compliance */}
            <DialogTitle className="visibly-hidden"></DialogTitle> 
            <div className="flex flex-col items-center">
                <img src="/logo.svg" alt="logo" width="100px" />
                <h2 className='font-bold text-lg mt-7'>Sign In to check out your travel plan</h2>
                
                {/* 3. Moved content OUT of DialogDescription to fix console warnings (cannot put div inside p) */}
                <div className='text-gray-500 mt-2 text-center'>
                    Sign in to the App with Google authentication securely
                </div>

                <Button
                    onClick={login}
                    className="w-full mt-6 flex gap-4 items-center">
                    <FcGoogle className="h-7 w-7" />Sign in With Google
                </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Header