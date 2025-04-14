// components/Share.jsx
import React from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Share({ links }) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-3">Share this article:</h3>
      <div className="flex gap-4">
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600">
          <FaWhatsapp size={22} />
        </a>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
          <FaFacebookF size={22} />
        </a>
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-500">
          <FaTwitter size={22} />
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900">
          <FaLinkedin size={22} />
        </a>
      </div>
    </div>
  );
}
