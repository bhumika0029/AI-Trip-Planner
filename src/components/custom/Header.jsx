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
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // <--- 1. Import Link & useNavigate

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  
  const navigate = useNavigate(); // <--- 2. Initialize Hook

  useEffect(() => {
    console.log(user)
  }, [user]) // Added dependency array to stop infinite logging

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
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload(); // Reloads to update header state
    }).catch((error) => {
      console.error("Error fetching user profile: ", error);
    });
  }

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <Link to={'/'}> {/* Added Link to make logo clickable */}
        <img src="/logo.svg" alt="Logo" />
      </Link>
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            
            {/* Used Link instead of <a> for smoother navigation */}
            <Link to="/create-trip">
              <Button variant="outline" className="rounded-full">+ Create Trip</Button>
            </Link>
            
            <Link to="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </Link>

            <Popover>
              <PopoverTrigger className='bg-transparent p-0'>            
                <img src={user?.picture} alt="" className='h-[35px] w-[35px] rounded-full' />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  
                  // 👇 THIS IS THE FIX
                  // Redirects to Home Page ("/") immediately
                  window.location.href = "/"; 
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div> : <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" width="100px" className='items-center' />
              <h2 className='font-bold text-lg mt-7'>Sign In to check out your travel plan</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-6 flex gap-4 items-center">
                <FcGoogle className="h-7 w-7" />Sign in With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Header