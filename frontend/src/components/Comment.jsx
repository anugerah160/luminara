import React, { useEffect, useState } from 'react';
import { getCommentsById, postComment } from '../services/articleService';
import { useNavigate } from 'react-router-dom';

export default function Comment({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const res = await getCommentsById(articleId);
      setComments(res);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await postComment(articleId, newComment);
      setNewComment('');
      fetchComments(); // refresh
    } catch (err) {
      setError('Failed to post comment.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          placeholder="Write your comment here..."
          className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-gray-800">{comment.user.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
