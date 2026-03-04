import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* <Header /> */}
        <main className="grow pt-0">
          <Routes>
            {/* Define routes here */}
            
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/blogs/:id" element={<BlogDetails />} /> */}
            {/* <Route path="/give" element={<Give />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            {/* <Route path="/join" element={<Join />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/about/mission" element={<Mission />} /> */}
            {/* <Route path="/about/vision" element={<Vision />} /> */}
            {/* <Route path="/about/leadership" element={<Leadership />} /> */}
            {/* <Route path="/programs" element={<Programs />} /> */}
            {/* <Route path="/events" element={<Events />} /> */}
            {/* <Route path="/prayer" element={<PrayerWall />} /> */}
            {/* <Route path="/discipleship" element={<Discipleship />} /> */}
            {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
            {/* <Route path="/terms" element={<Terms />} /> */}
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;