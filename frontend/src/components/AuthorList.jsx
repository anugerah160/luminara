import React from "react";

const authors = new Array(7).fill({
  name: "Selena Rodriguez",
  newsCount: "3 News",
  image: "https://via.placeholder.com/60x60", // placeholder image
});

const AuthorList = () => {
  return (
    <section className="mt-10 text-center">
      <div className="inline-block px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-3">
        Best Author
      </div>
      <h2 className="text-xl font-bold mb-4">Explore All Masterpieces<br />Written by People</h2>
      <div className="flex justify-center flex-wrap gap-6 px-4">
        {authors.map((author, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={author.image}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div className="text-sm font-semibold mt-2">{author.name}</div>
            <div className="text-xs text-gray-500">{author.newsCount}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AuthorList;
