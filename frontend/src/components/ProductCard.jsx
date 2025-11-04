import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ p, onOpen }) {
  const img =
    p.image_url ||
    (p.metadata && (p.metadata.main_image?.link || p.metadata.images?.[0])) ||
    "https://via.placeholder.com/300x180?text=No+image";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer flex flex-col h-full p-5 m-3"
      onClick={() => onOpen && onOpen(p.asin)}
    >
      <div className="h-48 w-full overflow-hidden">
        <img
          src={img}
          alt={p.title || p.asin}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <h3
          className="text-lg font-semibold text-gray-700 mb-2"
          title={p.title}
        >
          {p.title?.slice(0, 80) || p.asin}...
        </h3>

        <div className="flex items-center justify-between text-gray-600 mt-auto">
          <div className="text-gray-800 font-semibold">
            {p.price != null ? `${p.currency || "USD"} ${p.price}` : "0.00"}
          </div>
          <div className="text-yellow-500 font-medium">
            {p.rating ?? "—"} ⭐
          </div>
        </div>
      </div>
    </motion.div>
  );
}
