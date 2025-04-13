// src/components/HeroSlider.jsx
export default function HeroSlider() {
    return (
      <div className="w-full max-w-6xl mx-auto my-6 px-4">
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-black rounded-xl overflow-hidden">
          <img
            src="/dummy-hero.jpg"
            alt="Hero"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-sm mb-1">Featured</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              China vs Russia
            </h2>
            <p className="text-xs sm:text-sm">Jul 27, 2025 | Politics</p>
          </div>
          {/* Tombol panah bisa ditambah nanti */}
        </div>
      </div>
    );
  }
  