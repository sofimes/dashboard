import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listProducts } from "../api/productApi";
import SearchSync from "../components/SearchSync";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsin, setSelectedAsin] = useState(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listProducts({ page: 1, limit: 100, q: query });
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" },
  };

  return (
    <motion.div className="container mx-auto p-4">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md p-4 rounded-lg lg:py-9">
        <h1 className=" text-3xl font-bold text-gray-700">
          Amazon Product Dashboard
        </h1>

        <motion.div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Filter by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 pr-28 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={load}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-1 rounded-full hover:bg-gray-600 transition"
          >
            Search
          </button>
        </motion.div>
      </header>

      <div className="mb-6 mt-12 px-12">
        <SearchSync onSynced={load} />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products…</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.length ? (
            products.map((p) => (
              <motion.div
                key={p.asin}
                variants={cardVariants}
                whileHover="hover"
                className="h-80 md:h-96"
              >
                <ProductCard
                  p={p}
                  onOpen={(asin) => setSelectedAsin(asin)}
                  className="shadow-lg rounded-xl overflow-hidden bg-white"
                />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No products found</p>
          )}
        </motion.div>
      )}

      {selectedAsin && (
        <ProductDetails
          asin={selectedAsin}
          onClose={() => setSelectedAsin(null)}
        />
      )}
    </motion.div>
  );
}
