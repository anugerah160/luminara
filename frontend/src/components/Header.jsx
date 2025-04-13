import React from "react";

const Header = () => {
  return (
    <header className="bg-[#f2f2f2] w-full px-4 md:px-12 py-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo and Search */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-2xl font-bold tracking-wide">LUMINARA</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search hot trendy news today...."
            className="w-full px-4 py-2 rounded-md bg-black text-white placeholder:text-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-center justify-center">
          <button className="px-4 py-2 bg-black text-white rounded-md text-sm">Upgrade Pro</button>
          <button className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-md text-sm">Post Ads</button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4 flex flex-wrap gap-2 justify-start md:justify-center">
        {["Entertainment", "Automotive", "Health", "Politics", "Business", "Sports", "Foods"].map((cat) => (
          <button
            key={cat}
            className="border border-gray-300 px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition-all"
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
