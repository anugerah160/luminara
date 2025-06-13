import React from "react"

export default function AuthorCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg animate-fadeIn overflow-hidden">
      <div className="p-5 sm:p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-4 text-orange-500 text-2xl sm:text-3xl">
            {icon}
          </span>
          {title}
        </h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  )
}
