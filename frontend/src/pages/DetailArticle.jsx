import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleBySlug } from '../services/articleService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function DetailArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await getArticleBySlug(slug);
        setArticle(res);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (!article) return <p className="text-center py-10 text-red-500">Article not found.</p>;

  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Thumbnail */}
        <img
          src={article.thumbnail}
          alt={article.name}
          className="w-full h-64 object-cover rounded-2xl shadow mb-6"
        />

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
            {article.category?.name}
          </span>
          <span>By {article.author?.name} • {new Date(article.created_at).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.name}</h1>

        {/* Content */}
        <div className="prose max-w-none prose-lg mb-8">
          <p>{article.content}</p>
        </div>

        {/* Video (if any) */}
        {article.video && (
          <div className="mb-10">
            <video controls className="w-full rounded-xl shadow">
              <source src={article.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Share Links */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Share this article:</h3>
          <div className="flex space-x-4">
            <a href={article.share_links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
              <FaWhatsapp size={24} />
            </a>
            <a href={article.share_links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
              <FaFacebookF size={24} />
            </a>
            <a href={article.share_links.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <FaTwitter size={24} />
            </a>
            <a href={article.share_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
