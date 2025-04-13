import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import halaman
import Home from "./pages/Home";
import Category from "./pages/CategoryPage";
import ArticleDetail from "./pages/ArticleDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:id" element={<Category />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
