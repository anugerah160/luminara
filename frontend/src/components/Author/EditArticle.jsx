import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getArticleBySlug, updateArticle } from "../../services/articleService"
import { getAllCategories } from "../../services/categoryService"
import RichTextEditor from "./RichTextEditor"
import { FaEdit, FaCloudUploadAlt } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

export default function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [articleId, setArticleId] = useState(null)
  const [title, setTitle] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [preview, setPreview] = useState("")
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
        setPreview(article.thumbnail || "")
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !categoryId || !content) {
      alert("Please fill out all required fields.")
      return
    }
    setUpdating(true)

    const formData = new FormData()
    formData.append("_method", "PUT") // Method spoofing untuk Laravel
    formData.append("name", title)
    formData.append("content", content)
    formData.append("category_id", categoryId)
    formData.append("is_featured", isFeatured)
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile)
    }

    try {
      await updateArticle(articleId, formData)
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Thumbnail Preview"
                    className="mx-auto h-48 rounded-md"
                  />
                ) : (
                  <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                  >
                    <span>Change image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>
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
