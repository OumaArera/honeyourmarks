import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import Pricing from "../components/landing/Pricing";
import Footer from "../components/landing/Footer";


export default function LandingPage() {
  return (
    <div className="font-body overflow-x-hidden" style={{ background: "#FDF8F2", color: "#1B2F4E" }}>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}