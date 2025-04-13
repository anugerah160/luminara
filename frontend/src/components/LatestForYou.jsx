import React from "react";

const articles = [
  {
    title: "Musik Jazz lagi Trend di Tahun ini",
    date: "Feb 27, 2025",
    image: "https://via.placeholder.com/100x60",
  },
  {
    title: "Musik Jazz lagi Trend di Tahun ini",
    date: "Feb 27, 2025",
    image: "https://via.placeholder.com/100x60",
  },
  {
    title: "Musik Jazz lagi Trend di Tahun ini",
    date: "Feb 27, 2025",
    image: "https://via.placeholder.com/100x60",
  },
];

const LatestForYou = () => {
  return (
    <section className="mt-10 px-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold">Latest For You</h3>
          <p className="font-semibold">in Entertainment</p>
        </div>
        <a href="#" className="text-sm text-gray-500 hover:underline">Explore All</a>
      </div>
      <div className="md:flex gap-4">
        {/* Left Featured */}
        <div className="relative md:w-1/2">
          <img
            src="https://via.placeholder.com/600x300"
            alt="Featured"
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-3 left-3 text-white">
            <div className="text-xs font-light">Featured</div>
            <div className="text-lg font-bold">Sistem Pengemudian Otonom</div>
            <div className="text-xs">Feb 27, 2025</div>
          </div>
        </div>
        {/* Right List */}
        <div className="mt-4 md:mt-0 md:w-1/2 flex flex-col gap-3">
          {articles.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-white rounded-lg p-2 shadow">
              <img src={item.image} alt={item.title} className="w-16 h-10 object-cover rounded" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestForYou;
