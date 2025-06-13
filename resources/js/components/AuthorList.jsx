import React, { useEffect, useState } from "react";
import { getTopAuthors } from "../services/userService";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getTopAuthors();
        setAuthors(data);
      } catch (error) {
        console.error("Failed to fetch top authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <section className="mt-10 text-center">
      <div className="inline-block px-3 py-1 bg-orange-200 text-orange-700 rounded-full text-sm font-semibold mb-3">
        Best Author
      </div>
      <h2 className="text-xl font-bold mb-4">Explore All Masterpieces<br />Written by People</h2>

      {loading ? (
        <p className="text-gray-500">Loading top authors...</p>
      ) : (
        <div className="flex justify-center flex-wrap gap-6 px-4">
          {authors.map((author) => (
            <div key={author.id} className="flex flex-col items-center">
              <img
                src={author.picture ? author.picture : '/default.png'}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="text-sm font-semibold mt-2">{author.name}</div>
              <div className="text-xs text-gray-500">{author.articles_count} News</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AuthorList;
