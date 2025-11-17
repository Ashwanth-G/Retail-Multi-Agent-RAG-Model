import { useState } from "react";
import { getRecommendations } from "../lib/recommend";

export default function RecommendPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await getRecommendations({
        user_id: "123",   // optional
        query,
        top_k: 10,
      });

      setResults(response.results);
    } catch (err) {
      console.error("Recommendation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Recommendation System</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm">{item.brand}</p>
            <p className="text-sm">{item.category}</p>
            <p className="font-bold mt-2">₹{item.price}</p>
            <p className="text-xs text-gray-500 mt-2">
              Score: {item.score.toFixed(2)} | Semantic: {item.semantic.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
