import React, { useState, useEffect } from "react"
import { postArticle } from "../../services/articleService"
import { getAllCategories } from "../../services/categoryService"
import RichTextEditor from "./RichTextEditor"
import { FaPenNib, FaCloudUploadAlt } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

export default function PostArticle() {
  const [title, setTitle] = useState("")
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isFeatured, setIsFeatured] = useState("no")
  const [content, setContent] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [agreed, setAgreed] = useState(false)

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !thumbnail || !categoryId || !content) {
      alert("Please fill out Title, Thumbnail, Category, and Content.")
      return
    }
    if (!agreed) {
      alert("You must agree to the terms and conditions before posting.")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("name", title)
    formData.append("thumbnail", thumbnail)
    formData.append("content", content)
    formData.append("category_id", categoryId)
    formData.append("is_featured", isFeatured)

    try {
      await postArticle(formData)
      alert("Article posted successfully!")
      // Reset form
      setTitle("")
      setThumbnail(null)
      setPreview("")
      setCategoryId("")
      setIsFeatured("no")
      setContent("")
      setAgreed(false)
    } catch (err) {
      console.error("Post failed:", err)
      alert("Failed to post article. Check console for details.")
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail (Required)
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
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
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
          <div className="mt-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-3a1 1 0 001 1h.01a1 1 0 100-2H10a1 1 0 00-1 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    By posting this article, you agree to our terms and
                    conditions. You are responsible for the content and must
                    ensure it is not misleading, false, or malicious. All
                    articles are subject to review.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreement"
                  name="agreement"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="agreement"
                  className="font-medium text-gray-700"
                >
                  I have read and agree to the terms and conditions.
                </label>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={loading || !agreed}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>
      )}
    </AuthorCard>
  )
}
