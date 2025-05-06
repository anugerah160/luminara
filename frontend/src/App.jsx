import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Category from "./pages/CategoryPage";
import DetailArticle from "./pages/DetailArticle";
import ArticleSearch from "./pages/ArticleSearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from './components/PrivateRoute';
import AuthorLayout from './pages/AuthorLayout';
import Profile from './components/Author/Profile';
import PostArticle from './components/Author/PostArticle';
import ManageArticles from './components/Author/ManageArticles';
import EditArticle from './components/Author/EditArticle';

function App() {
  return (
    <Router basename="/luminara">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />        
        <Route path="/register" element={<Register />} />        
        <Route path="/" element={<Home />} />
        <Route path="/categories/:id" element={<Category />} />
        <Route path="/articles/:slug" element={<DetailArticle />} />
        <Route path="/search" element={<ArticleSearch />} />

        {/*PrivateRoute */}
        <Route
          path="/author/*"
          element={
            <PrivateRoute>
              <AuthorLayout />
            </PrivateRoute>
          }>
          <Route path="profile" element={<Profile />} />
          <Route path="post-article" element={<PostArticle />} />
          <Route path="manage-articles" element={<ManageArticles />} />
          <Route path="manage-articles/:slug" element={<EditArticle />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
