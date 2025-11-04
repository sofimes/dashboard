import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { syncASIN } from "../api/productApi";

export default function SearchSync({ onSynced }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);

  const runSync = async (singleAsin) => {
    const asins = singleAsin
      ? [singleAsin]
      : value
          .split(/[,\s/]+/)
          .map((s) => s.trim())
          .filter(Boolean);

    setLoading(true);
    setLog([]);

    for (const asin of asins) {
      try {
        await syncASIN(asin);
        setLog((l) => [...l, { asin, ok: true }]);
      } catch (err) {
        setLog((l) => [
          ...l,
          { asin, ok: false, err: err.response?.data?.error || err.message },
        ]);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    setLoading(false);
    setValue("");
    onSynced && onSynced();
  };
  return (
    <motion.div className="w-full max-w-xl mx-auto">
      {/* Input + Button */}
      <div className="relative mb-4 ">
        <input
          type="text"
          placeholder="Enter ASIN (e.g. B073JYC4XM)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-5 pr-36 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={() => runSync()}
          disabled={loading || !value.trim()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-5 mr-2 py-3 rounded-full hover:bg-gray-600 transition"
        >
          {loading ? "Syncing…" : "Sync ASIN(s)"}
        </button>
      </div>

      {/* Log */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {log.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-lg shadow ${
                l.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {l.asin} — {l.ok ? "OK" : `ERR: ${l.err}`}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
