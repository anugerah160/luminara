import React from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHeading,
  FaImage,
  FaUpload,
  FaParagraph,
  FaAlignJustify,
} from 'react-icons/fa'

export default function RichTextToolbar({ editor }) {
  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      editor.chain().focus().setImage({ src: reader.result }).run()
    }
    reader.readAsDataURL(file)
  }

  const buttonStyle = (isActive) =>
    `p-2 rounded text-sm transition hover:bg-gray-200 ${
      isActive ? 'bg-blue-100 text-blue-700 font-semibold' : ''
    }`

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonStyle(editor.isActive('bold'))}>
        <FaBold />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonStyle(editor.isActive('italic'))}>
        <FaItalic />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonStyle(editor.isActive('underline'))}>
        <FaUnderline />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonStyle(editor.isActive('bulletList'))}>
        <FaListUl />
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonStyle(editor.isActive('paragraph'))}>
        <FaParagraph />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonStyle(editor.isActive('heading', { level: 1 }))}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonStyle(editor.isActive('heading', { level: 2 }))}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonStyle(editor.isActive('heading', { level: 3 }))}>
        H3
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonStyle(editor.isActive({ textAlign: 'left' }))}>
        <FaAlignLeft />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonStyle(editor.isActive({ textAlign: 'center' }))}>
        <FaAlignCenter />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonStyle(editor.isActive({ textAlign: 'right' }))}>
        <FaAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonStyle(editor.isActive({ textAlign: 'justify' }))}>
        <FaAlignJustify />
      </button>
      <button onClick={addImage} className={buttonStyle(false)}>
        <FaImage />
      </button>
      <label className={buttonStyle(false)}>
        <FaUpload />
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  )
}
