import React from "react"

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  )
}
