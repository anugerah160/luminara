import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getFeaturedArticles } from "../services/articleService"
import LoadingSpinner from "./Author/LoadingSpinner" // Menggunakan spinner yang sama

export default function FeaturedNews() {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchFeaturedArticles() {
      try {
        const data = await getFeaturedArticles()
        // Pastikan hanya 5 artikel, atau kurang jika tidak tersedia
        setFeaturedArticles(data.slice(0, 5))
      } catch (err) {
        console.error("Error fetching featured articles:", err)
        setError("Failed to load featured articles.")
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedArticles()
  }, [])

  useEffect(() => {
    if (featuredArticles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          (prevIndex + 1) % featuredArticles.length
        )
      }, 5000) // Geser setiap 5 detik
      return () => clearInterval(interval) // Cleanup interval
    }
  }, [featuredArticles]) // Jalankan ulang jika daftar artikel berubah

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    )
  }

  if (featuredArticles.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No featured articles available.
      </div>
    )
  }

  const currentArticle = featuredArticles[currentIndex]

  return (
    <section className="relative w-full h-[500px] overflow-hidden group ">
      {/* Container untuk slide, akan bergerak */}
      <div
        className="absolute inset-0 flex transition-transform ease-out duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredArticles.map((article, index) => (
          <div
            key={article.id}
            className="w-full flex-shrink-0 relative"
            style={{ backgroundImage: `url(${article.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white w-full md:w-2/3 lg:w-1/2">
              <h2 className="text-4xl font-bold mb-4">
                <Link to={`/articles/${article.slug}`} className="hover:text-orange-400 transition-colors">
                  {article.name}
                </Link>
              </h2>
              <p className="text-lg mb-4 line-clamp-2">
                {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
              <div className="text-sm">
                By{" "}
                <Link to={`/author/${article.author.id}`} className="font-semibold hover:text-orange-400 transition-colors">
                  {article.author.name}
                </Link>{" "}
                in{" "}
                <Link to={`/category/${article.category.id}`} className="font-semibold hover:text-orange-400 transition-colors">
                  {article.category.name}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indikator Navigasi (dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full bg-white ${
              index === currentIndex ? "opacity-100" : "opacity-50"
            } hover:opacity-100 transition-opacity duration-300`}
          ></button>
        ))}
      </div>
    </section>
  )
}