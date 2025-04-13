import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategoryById } from '../services/categoryService';
import NewsCard from '../components/NewsCard';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchCategoryArticles() {
      try {
        const res = await getCategoryById(id);
        setArticles(res);

        if (res.length > 0) {
          const nameMap = {
            1: 'Sports',
            2: 'Entertainment',
            3: 'Health',
            4: 'Business',
            5: 'Politics',
            6: 'Automotive',
          };
          setCategoryName(nameMap[res[0].category_id] || 'News');
        } else {
          setCategoryName('News');
        }

        setPage(1); // Reset page on new category
      } catch (err) {
        console.error('Failed to fetch category articles:', err);
      }
    }

    fetchCategoryArticles();
  }, [id]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = articles.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Tambahkan placeholders
  const placeholders = Array(itemsPerPage - currentItems.length).fill(null);

  return (
    <>
      <Navbar />
      <CategoryBar />

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          Explore Our <span className="text-blue-600">{categoryName}</span> News
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[600px]">
          {[...currentItems, ...placeholders].map((article, i) =>
            article ? (
              <NewsCard key={article.id} article={article} />
            ) : (
              <div
                key={`placeholder-${i}`}
                className="border rounded-md shadow-sm h-[330px] bg-white"
              />
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                  page === i + 1
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <AdBanner />
        <Footer />
      </div>
    </>
  );
}
