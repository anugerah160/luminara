import React, { useEffect, useState } from 'react';
import { getMyArticles, deleteArticle } from '../../services/articleService';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getMyArticles();
        setArticles(data);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleEdit = (slug) => {
    navigate(`/author/manage-articles/${slug}`);
  };

  const handleDelete = async (article) => {
    const confirmation = window.prompt(`Type the title to confirm deletion: "${article.name}"`);
    if (confirmation !== article.name) {
      alert('Confirmation does not match. Article not deleted.');
      return;
    }

    try {
      await deleteArticle(article.id);
      setArticles(prev => prev.filter(a => a.id !== article.id));
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🛠 Manage Articles</h2>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <>
          <table className="w-full border-collapse bg-white shadow-sm rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Thumbnail</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article, index) => (
                <tr key={article.id}>
                  <td className="p-3 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="p-3 border">
                    {article.thumbnail ? (
                      <img src={article.thumbnail} alt="thumb" className="h-16 w-24 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="p-3 border">{article.name}</td>
                  <td className="p-3 border">{article.category?.name || '-'}</td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleEdit(article.slug)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
