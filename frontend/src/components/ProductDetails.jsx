import React, { useEffect, useState } from "react";
import { getProduct } from "../api/productApi";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails({ asin, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!asin) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const p = await getProduct(asin);

        if (!cancelled) {
          const extracted = {
            asin: p.asin,
            title: p.title || p.metadata?.title || "No title",
            description:
              p.description ||
              p.metadata?.description ||
              p.book_description ||
              "No description",
            price:
              p.price ??
              p.metadata?.buybox_price?.value ??
              p.variants?.[0]?.price?.value ??
              p.variants?.find((v) => v.is_current_product)?.price?.value ??
              0,
            currency:
              p.currency ??
              p.metadata?.buybox_price?.currency ??
              p.variants?.[0]?.price?.currency ??
              "USD",
            rating: p.rating ?? p.metadata?.rating ?? 0,
            ratings_total:
              p.review_count ??
              p.metadata?.reviews_total ??
              p.metadata?.ratings_total ??
              0,
            image_url:
              p.image_url ||
              p.metadata?.main_image?.link ||
              (p.metadata?.images && p.metadata.images[0]) ||
              "https://via.placeholder.com/400x250?text=No+image",
            metadata: p.metadata ?? {},
          };

          setProduct(extracted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error || err.message || "Failed to load product"
          );
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [asin]);

  if (!asin) return null;

  return (
    <AnimatePresence>
      {asin && (
        <motion.div
          className="fixed inset-0  bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-auto p-6 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            {loading && (
              <p className="text-gray-600 text-center py-8">
                Loading product...
              </p>
            )}

            {error && (
              <div className="text-red-600 bg-red-100 p-4 rounded-md my-4">
                <p className="font-semibold">Error loading product:</p>
                <pre className="text-sm">{String(error)}</pre>
              </div>
            )}

            {!loading && !error && product && (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="flex flex-col items-center shadow-md p-4 rounded-xl">
                  <img
                    src={product.image_url}
                    alt={product.title || product.asin}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-xl font-semibold text-gray-800">
                    {product.currency} {product.price}
                  </p>
                  <p className="text-yellow-500 font-medium">
                    {product.rating} ⭐ ({product.ratings_total})
                  </p>
                </div>

                <div className="flex flex-col ">
                  <h2 className="text-2xl font-bold text-gray-700 mb-4">
                    {product.title}
                  </h2>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
