import React from "react";
import dummyHero from '../assets/dummy-article1.jpg';

const AdBanner = () => {
  return (
    <div className="mt-8 px-4 justify-items-center">
      <img
        src={dummyHero}
        alt="Ad Banner"
        className="w-[20%] rounded-lg shadow"
      />
    </div>
  );
};

export default AdBanner;
