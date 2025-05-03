import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  // Category list dummy (bisa diganti dari API kalau mau)
  const categories = ['Technology', 'Science', 'Art', 'Business', 'Lifestyle'];

  // Cek user login
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Invalid user data in localStorage');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login'); // kalau tidak login, lempar ke /login
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!title || !thumbnail || !category || !content) {
      alert('Please fill in all fields');
      return;
    }

    // Simulasi post data (di sini kamu bisa panggil API)
    const newArticle = {
      title,
      thumbnail,
      category,
      content,
      authorId: user?.id,
    };

    console.log('Posting article:', newArticle);
    alert('Article submitted successfully!');
    // Reset form (optional)
    setTitle('');
    setThumbnail('');
    setCategory('');
    setContent('');

    // Arahkan balik ke halaman utama (atau page article list)
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">✍️ Write a New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="Enter article title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="Enter thumbnail image URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2 h-40"
            placeholder="Write your article content here..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Publish Article
        </button>
      </form>
    </div>
  );
}
