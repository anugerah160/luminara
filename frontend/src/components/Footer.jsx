import React from "react";
import { FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-20 bg-white border-t py-10 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Brand & Contact */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Winnicode Garuda</h4>
          <p className="flex items-center gap-2 mb-2">
            <FaEnvelope className="text-gray-500" /> winnicodegarudaofficial@gmail.com
          </p>
          <p className="flex items-center gap-2 mb-2">
            <FaInstagram className="text-gray-500" /> @winnicodeofficial
          </p>
        </div>

        {/* Alamat Pusat */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-2">Alamat Pusat</h4>
          <p className="mb-1">
            Jl. Asia Afrika No.158, Kb. Pisang, <br />
            Kec. Sumur Bandung, Kota Bandung, <br />
            Jawa Barat 40261
          </p>
        </div>

        {/* Alamat Cabang */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-2">Alamat Cabang</h4>
          <p>Bantul, Yogyakarta</p>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="text-center mt-10 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Winnicode Garuda. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
