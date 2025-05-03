import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Author/Sidebar';
import Profile from '../components/Author/Profile';
import PostArticle from '../components/Author/PostArticle';
import ManageArticles from '../components/Author/ManageArticles';

export default function AuthorPage() {
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Invalid user data');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return <Profile user={user} />;
      case 'post':
        return <PostArticle />;
      case 'manage':
        return <ManageArticles />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
