// src/components/author/EditArticle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleBySlug, updateArticle } from '../../services/articleService';
import { getAllCategories } from '../../services/categoryService';
import RichTextEditor from './RichTextEditor';

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [articleId, setArticleId] = useState(null);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState('no');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [article, cats] = await Promise.all([
          getArticleBySlug(slug),
          getAllCategories(),
        ]);

        setArticleId(article.id);
        setTitle(article.name);
        setThumbnail(article.thumbnail || '');
        setCategoryId(article.category_id);
        setIsFeatured(article.is_featured);
        setContent(article.content);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load article or categories:', err);
        alert('Error loading article or categories.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  const handleSubmit = async () => {
    if (!title || !categoryId || !content) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setUpdating(true);
      const articleData = {
        name: title,
        thumbnail,
        content,
        category_id: categoryId,
        is_featured: isFeatured,
      };
      await updateArticle(articleId, articleData);
      alert('Article updated successfully!');
      navigate('/author/manage-articles');
    } catch (err) {
      console.error('Failed to update article:', err);
      alert('Failed to update article.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading article...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📝 Edit Article</h2>

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
          disabled={updating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {updating ? 'Updating...' : 'Update Article'}
        </button>

        <button
          onClick={() => navigate('/author/manage-articles')}
          className="ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
