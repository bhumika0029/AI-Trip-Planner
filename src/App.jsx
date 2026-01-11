import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Hero from './components/custom/Hero'
import CreateTrip from './create-trip/index.jsx'
import ViewTrip from './view-trip/[tripId]/index.jsx'
import MyTrips from './my-trips/index.jsx' 
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner.jsx'

function App() {
  return (
    <>
      {/* 👇 FIXED: Added 'future' prop to opt-in to v7 behaviors 
         and silence the console warnings.
      */}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
      
        <Header />
        
        <Toaster />
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App