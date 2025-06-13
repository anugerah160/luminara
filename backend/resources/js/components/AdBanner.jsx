import React from "react";
import dummyHero from "../assets/banner.png";

const AdBanner = () => {
  return (
    <div className="mt-8 px-4 mb-6">
      <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <a
          href="https://course.anugerah.website"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <img
            src={dummyHero}
            alt="Ad Banner"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-sm sm:text-base text-center py-2 backdrop-blur-sm hover:bg-black/60 transition">
            Sponsored – Click to Learn More
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdBanner;
