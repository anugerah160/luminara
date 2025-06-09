import React, { useState, useEffect } from "react"
import { postArticle } from "../../services/articleService"
import { getAllCategories } from "../../services/categoryService"
import RichTextEditor from "./RichTextEditor"
import { FaPenNib } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

export default function PostArticle() {
  const [title, setTitle] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isFeatured, setIsFeatured] = useState("no")
  const [content, setContent] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (err) {
        console.error("Failed to load categories:", err)
      } finally {
        setPageLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    if (!title || !categoryId || !content) {
      alert("Please fill out Title, Category, and Content.")
      return
    }

    setLoading(true)
    try {
      const articleData = {
        name: title,
        thumbnail,
        content,
        category_id: categoryId,
        is_featured: isFeatured,
      }
      await postArticle(articleData)
      alert("Article posted successfully!")
      // Reset form
      setTitle("")
      setThumbnail("")
      setCategoryId("")
      setIsFeatured("no")
      setContent("")
    } catch (err) {
      console.error("Post failed:", err)
      alert("Failed to post article.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthorCard icon={<FaPenNib />} title="Post a New Article">
      {pageLoading ? (
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
          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>
      )}
    </AuthorCard>
  )
}
