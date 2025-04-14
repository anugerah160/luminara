import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import FeaturedNews from '../components/FeaturedNews';
import NewsCard from '../components/NewsCard';
import AuthorList from "../components/AuthorList";
import AdBanner from "../components/AdBanner";
import LatestForYou from "../components/LatestForYou";
import Footer from "../components/Footer";
import { getAllArticles } from '../services/articleService';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await getAllArticles();
        setArticles(res);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const trendingArticles = articles.filter(
    (article) => article.is_featured && article.is_featured.toLowerCase() === 'yes'
  );

  const totalPages = Math.ceil(trendingArticles.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = trendingArticles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-gray-50 text-gray-900">
      <Navbar />
      <CategoryBar />
      <FeaturedNews />

      {/* Latest Trend News */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Latest Trend News</h2>
            <p className="text-sm text-gray-600">Good for Curiousity</p>
          </div>
          <button className="bg-orange-400 text-white px-3 py-1 rounded text-sm hover:bg-orange-500 transition">
            Up To Date
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : trendingArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentItems.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 text-sm rounded ${
                      page === i + 1
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No trending articles found.</p>
        )}
      </div>

      <AuthorList />
      <AdBanner />
      <LatestForYou categoryId={1} />
      <LatestForYou categoryId={2} />
      <LatestForYou categoryId={3} />
      <Footer />
    </div>
  );
}
