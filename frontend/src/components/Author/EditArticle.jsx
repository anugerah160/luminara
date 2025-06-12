import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getArticleBySlug, updateArticle } from "../../services/articleService"
import { getAllCategories } from "../../services/categoryService"
import RichTextEditor from "./RichTextEditor"
import { FaEdit, FaCloudUploadAlt, FaLink, FaTrashAlt } from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import LoadingSpinner from "./LoadingSpinner"

export default function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [articleId, setArticleId] = useState(null)
  const [title, setTitle] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [currentThumbnailFromDb, setCurrentThumbnailFromDb] = useState("");
  const [preview, setPreview] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isFeatured, setIsFeatured] = useState("no")
  const [content, setContent] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [thumbnailInputType, setThumbnailInputType] = useState('file');
  const [shouldRemoveThumbnail, setShouldRemoveThumbnail] = useState(false);


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
        
        setCurrentThumbnailFromDb(article.thumbnail || "");
        setPreview(article.thumbnail || "");

        if (article.thumbnail && (article.thumbnail.startsWith('http://') || article.thumbnail.startsWith('https://'))) {
          setThumbnailUrl(article.thumbnail);
          setThumbnailInputType('url');
          setThumbnailFile(null);
        } else if (article.thumbnail) {
          setThumbnailFile(null);
          setThumbnailUrl("");
          setThumbnailInputType('file');
        } else {
          setThumbnailFile(null);
          setThumbnailUrl("");
          setPreview(""); // Pastikan preview kosong jika tidak ada thumbnail
          setThumbnailInputType('file');
        }
        setShouldRemoveThumbnail(false); // Reset this on load

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
      setThumbnailUrl("") // Clear URL if file is selected
      setPreview(URL.createObjectURL(file))
      setShouldRemoveThumbnail(false); // Jika upload file, batalkan niat hapus
    } else {
      setThumbnailFile(null);
      // Jika input file dikosongkan, kembali ke thumbnail DB jika ada, atau kosongkan
      setPreview(currentThumbnailFromDb || "");
    }
  }

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setThumbnailUrl(url);
    setThumbnailFile(null); // Clear file if URL is entered
    setPreview(url); // Set preview to the URL
    setShouldRemoveThumbnail(false); // Jika mengisi URL, batalkan niat hapus
    // Jika URL dikosongkan, kembali ke thumbnail DB jika ada
    if (!url) {
      setPreview(currentThumbnailFromDb || "");
    }
  }

  const handleRemoveThumbnail = () => {
    if (window.confirm("Are you sure you want to remove the thumbnail?")) {
      setThumbnailFile(null);
      setThumbnailUrl("");
      setPreview(""); // Kosongkan preview
      setShouldRemoveThumbnail(true); // Set flag untuk dihapus di backend
      setThumbnailInputType('file'); // Default ke input file setelah dihapus
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault() 
    if (!title || !categoryId || !content) {
      alert("Please fill out all required fields.")
      return
    }

    setUpdating(true)

    const formData = new FormData()
    formData.append("name", title)
    formData.append("content", content)
    formData.append("category_id", categoryId)
    formData.append("is_featured", isFeatured)
    
    // Logika pengiriman thumbnail
    if (shouldRemoveThumbnail) {
        formData.append("should_remove_thumbnail", true);
        formData.append("thumbnail", ""); // Kirim kosong juga untuk memastikan
        formData.append("thumbnail_url", ""); // Kirim kosong juga untuk memastikan
    } else if (thumbnailInputType === 'file' && thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
    } else if (thumbnailInputType === 'url' && thumbnailUrl) {
        formData.append("thumbnail_url", thumbnailUrl);
    } 

    try {
      await updateArticle(articleId, formData)
      alert("Article updated successfully!")
      navigate("/author/manage-articles")
    } catch (err) {
      console.error("Failed to update article:", err)
      if (err.response && err.response.data && err.response.data.errors) {
          const errors = err.response.data.errors;
          let errorMessage = "Failed to update article:\n";
          for (const key in errors) {
              errorMessage += `- ${errors[key].join(', ')}\n`;
          }
          alert(errorMessage);
      } else {
          alert("Failed to update article.");
      }
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AuthorCard icon={<FaEdit />} title="Edit Article">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center space-x-4 mb-3">
              <button
                type="button"
                onClick={() => {
                  setThumbnailInputType('file');
                  // Saat beralih, jika tidak ada file baru/URL baru, gunakan preview dari DB
                  if (!thumbnailFile && !thumbnailUrl && currentThumbnailFromDb) {
                      setPreview(currentThumbnailFromDb);
                  } else if (!thumbnailFile && !thumbnailUrl && !currentThumbnailFromDb) {
                      setPreview(""); // Jika memang kosong dari awal
                  }
                  setThumbnailUrl(""); // Clear URL input saat beralih ke file
                  setShouldRemoveThumbnail(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  thumbnailInputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaCloudUploadAlt className="inline mr-2" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setThumbnailInputType('url');
                  // Saat beralih, jika tidak ada file baru/URL baru, gunakan preview dari DB
                  if (!thumbnailFile && !thumbnailUrl && currentThumbnailFromDb) {
                    setPreview(currentThumbnailFromDb);
                  } else if (!thumbnailFile && !thumbnailUrl && !currentThumbnailFromDb) {
                    setPreview(""); // Jika memang kosong dari awal
                  }
                  // Jika URL sudah ada dari DB, set kembali ke input field
                  if (currentThumbnailFromDb && (currentThumbnailFromDb.startsWith('http://') || currentThumbnailFromDb.startsWith('https://'))) {
                      setThumbnailUrl(currentThumbnailFromDb);
                  } else {
                      setThumbnailUrl(""); // Kosongkan jika bukan URL
                  }
                  setThumbnailFile(null); // Clear file input saat beralih ke URL
                  setShouldRemoveThumbnail(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  thumbnailInputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaLink className="inline mr-2" /> Use URL
              </button>
              {/* Tombol Hapus Thumbnail */}
              {(currentThumbnailFromDb || thumbnailFile || thumbnailUrl) && (
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  <FaTrashAlt className="inline mr-2" /> Remove Thumbnail
                </button>
              )}
            </div>

            {thumbnailInputType === 'file' ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Thumbnail Preview"
                      className="mx-auto h-48 w-auto rounded-md"
                    />
                  ) : (
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none"
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
            ) : (
              <div className="mt-1">
                <input
                  type="url"
                  placeholder="Enter thumbnail URL (e.g., https://example.com/image.jpg)"
                  value={thumbnailUrl}
                  onChange={handleUrlChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                {preview && (
                  <div className="mt-4 text-center">
                    <img
                      src={preview}
                      alt="Thumbnail Preview"
                      className="mx-auto h-48 rounded-md border"
                    />
                    <p className="text-sm text-gray-500 mt-2">Preview from URL</p>
                  </div>
                )}
              </div>
            )}
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
              type="button"
              onClick={() => navigate("/author/manage-articles")}
              className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {updating ? "Updating..." : "Update Article"}
            </button>
          </div>
        </form>
      )}
    </AuthorCard>
  )
}