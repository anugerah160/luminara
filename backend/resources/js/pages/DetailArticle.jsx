import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleBySlug, getArticlesByAuthor } from '../services/articleService';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import Footer from '../components/Footer';
import AuthorInfo from '../components/AuthorInfo';
import MoreFromAuthor from '../components/MoreFromAuthor';
import Share from '../components/Share';
import AdBanner from '../components/AdBanner';
import Comment from '../components/Comment';

export default function DetailArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await getArticleBySlug(slug);
        setArticle(res);
        if (res?.author?.id) {
          const related = await getArticlesByAuthor(res.author.id);
          setRelatedArticles(related.filter((a) => a.slug !== slug));
        }
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
    <div className="bg-white text-gray-900">
      <Navbar />
      {/* <CategoryBar /> */}

      {/* Meta Info */}
      <div className="max-w-7xl mx-auto px-6 mt-6 text-sm text-gray-500 flex justify-between items-center">
        <span className="text-xs uppercase tracking-wide">
          {new Date(article.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
          {article.category?.name}
        </span>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-8">

          {/* Thumbnail */}
          <img
            src={article.thumbnail}
            alt={article.name}
            className="w-full h-[400px] object-cover rounded-xl mb-6"
          />

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 leading-tight">{article.name}</h1>

          {/* Content */}
          <div
            className="prose max-w-none prose-lg text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>

          {/* Share */}
          <Share links={article.share_links} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">

          {/* Ad Banner */}
          <AdBanner/>

          {/* Author Info */}
          <AuthorInfo author={article.author} />

          {/* More from Author */}
          <MoreFromAuthor authorName={article.author?.name} articles={relatedArticles} />
        </aside>
      </div>
      <Comment articleId={article.id} />
      <Footer />
    </div>
  );
}
