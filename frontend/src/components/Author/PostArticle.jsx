import React, { useState, useEffect } from 'react'
import { postArticle } from '../../services/articleService'
import { getAllCategories } from '../../services/categoryService'
import RichTextEditor from './RichTextEditor'

export default function PostArticle() {
  const [title, setTitle] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState('no')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    if (!title || !categoryId || !content) {
      alert('Please fill out all required fields.')
      return
    }

    try {
      setLoading(true)
      const articleData = {
        name: title,
        thumbnail,
        content,
        category_id: categoryId,
        is_featured: isFeatured,
      }
      await postArticle(articleData)
      alert('Article posted successfully!')
      setTitle('')
      setThumbnail('')
      setCategoryId('')
      setIsFeatured('no')
      setContent('')
    } catch (err) {
      console.error('Post failed:', err)
      alert('Failed to post article.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">✍️ Post Article</h2>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Thumbnail URL (optional)"
          className="w-full px-4 py-2 border rounded"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="mr-4">Featured:</label>
          <select
            value={isFeatured}
            onChange={(e) => setIsFeatured(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <RichTextEditor value={content} onChange={setContent} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {loading ? 'Posting...' : 'Submit Article'}
        </button>
      </div>
    </div>
  )
}
