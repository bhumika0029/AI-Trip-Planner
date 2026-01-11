import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Plane, Sparkles } from 'lucide-react'; // Make sure to install lucide-react

function Hero() {
  return (
    <div className='relative flex flex-col items-center justify-center mx-auto max-w-7xl px-6 md:px-12 gap-10 py-16 mb-24'>
      
      {/* Background Decor - Optional Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#f56551]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />


      {/* Main Headline */}
      <h1 className='font-extrabold text-4xl md:text-[60px] text-center leading-tight tracking-tight text-slate-900'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> <br className="hidden md:block" />
        Personalized Itineraries at Your Fingertips
      </h1>

      {/* Subtitle */}
      <p className='text-lg md:text-xl text-gray-500 text-center max-w-2xl leading-relaxed'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      {/* Call to Action */}
      <Link to={'/create-trip'}>
        <Button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-[#f56551] to-orange-600 hover:from-[#e05845] hover:to-orange-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
           Get Started, It's Free 🚀
        </Button>
      </Link>

      {/* Hero Image */}
      <div className="mt-10 relative w-full max-w-5xl">
        {/* Optional floating elements (Icons) */}
        <div className="absolute -top-10 -left-10 bg-white p-3 rounded-2xl shadow-xl hidden md:block animate-bounce delay-700">
             <Plane className="w-8 h-8 text-[#f56551]" />
        </div>
        <div className="absolute -bottom-10 -right-10 bg-white p-3 rounded-2xl shadow-xl hidden md:block animate-bounce delay-1000">
             <MapPin className="w-8 h-8 text-blue-500" />
        </div>

        <img 
            src="/landing.png" 
            alt="Dashboard Preview" 
            className='w-full rounded-2xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-shadow duration-500' 
        />
      </div>

    </div>
  )
}

export default Hero;