import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getArticleBySlug, updateArticle } from "../../services/articleService"
import { getAllCategories } from "../../services/categoryService"
import RichTextEditor from "./RichTextEditor"
import { FaEdit } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

export default function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [articleId, setArticleId] = useState(null)
  const [title, setTitle] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isFeatured, setIsFeatured] = useState("no")
  const [content, setContent] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [article, cats] = await Promise.all([
          getArticleBySlug(slug),
          getAllCategories(),
        ])
        setArticleId(article.id)
        setTitle(article.name)
        setThumbnail(article.thumbnail || "")
        setCategoryId(article.category_id)
        setIsFeatured(article.is_featured)
        setContent(article.content)
        setCategories(cats)
      } catch (err) {
        console.error("Failed to load data:", err)
        alert("Error loading article data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const handleSubmit = async () => {
    if (!title || !categoryId || !content) {
      alert("Please fill out all required fields.")
      return
    }
    setUpdating(true)
    try {
      const articleData = {
        name: title,
        thumbnail,
        content,
        category_id: categoryId,
        is_featured: isFeatured,
      }
      await updateArticle(articleId, articleData)
      alert("Article updated successfully!")
      navigate("/author/manage-articles")
    } catch (err) {
      console.error("Failed to update article:", err)
      alert("Failed to update article.")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AuthorCard icon={<FaEdit />} title="Edit Article">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            className="w-full text-2xl font-bold px-4 py-2 border-b-2 focus:outline-none focus:border-orange-500"
          />
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Thumbnail URL (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div>
              <label className="mr-4 font-medium">Featured Article?</label>
              <select
                value={isFeatured}
                onChange={(e) => setIsFeatured(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <RichTextEditor value={content} onChange={setContent} />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate("/author/manage-articles")}
              className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {updating ? "Updating..." : "Update Article"}
            </button>
          </div>
        </div>
      )}
    </AuthorCard>
  )
}
