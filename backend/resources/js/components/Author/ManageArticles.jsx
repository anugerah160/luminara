import React, { useEffect, useState } from "react"
import { getMyArticles, deleteArticle } from "../../services/articleService"
import { useNavigate } from "react-router-dom"
import { FaTasks, FaEdit, FaTrash } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

const ITEMS_PER_PAGE = 5

export default function ManageArticles() {
  const [articles, setArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      try {
        const data = await getMyArticles()
        setArticles(data)
      } catch (err) {
        console.error("Failed to fetch articles:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const handleEdit = (slug) => {
    navigate(`/author/manage-articles/${slug}`)
  }

  const handleDelete = async (article) => {
    const confirmation = window.prompt(
      `Type the title to confirm deletion: "${article.name}"`
    )
    if (confirmation !== article.name) {
      alert("Confirmation does not match. Article not deleted.")
      return
    }

    try {
      await deleteArticle(article.id)
      setArticles((prev) => prev.filter((a) => a.id !== article.id))
    } catch (err) {
      alert("Delete failed")
      console.error(err)
    }
  }

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE)
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <AuthorCard icon={<FaTasks />} title="Manage Articles">
      {loading ? (
        <LoadingSpinner />
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No articles found. Time to write one!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article, index) => (
                <tr key={article.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-500">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-4">
                    <img
                      src={article.thumbnail || "/luminara/default.png"}
                      alt="thumb"
                      className="h-16 w-24 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {article.name}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.category?.name || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(article.slug)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(article)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm border rounded-lg font-semibold ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AuthorCard>
  )
}
