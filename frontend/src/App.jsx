import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import halaman
import Home from "./pages/Home";
import Category from "./pages/CategoryPage";
import DetailArticle from "./pages/DetailArticle";
import ArticleSearch from "./pages/ArticleSearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>        
        <Route path="/register" element={<Register />}/>        
        <Route path="/" element={<Home />} />
        <Route path="/categories/:id" element={<Category />} />
        <Route path="/articles/:slug" element={<DetailArticle />} />
        <Route path="/search" element={<ArticleSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
