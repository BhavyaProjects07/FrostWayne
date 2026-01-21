'use client'

const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Health",
  "Toys & Games",
  "Sports & Outdoors",
  "Books & Media",
  "Food & Drink",
  "Hobbies & Crafts",
  "Others",
]

export default function FilterSidebar({ filters, setFilters }) {

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }))
  }

  return (
    <aside className="w-full sm:w-64 border border-[#ede6dd] rounded-lg p-4 bg-[#fefdfb] sticky top-28 h-fit">
      <h3 className="font-semibold text-[#6b5d52] mb-5 text-base">
        Filters
      </h3>

      {/* CATEGORY */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-[#6b5d52]">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="accent-[#6b5d52]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-[#6b5d52]">
          Price
        </h4>
        <input
          type="range"
          min={100}
          max={100000}
          step={100}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters(prev => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full accent-[#6b5d52]"
        />
        <p className="text-xs text-slate-500 mt-2">
          Up to ₹{filters.maxPrice.toLocaleString()}
        </p>
      </div>

      {/* RATING */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-[#6b5d52]">
          Customer Rating
        </h4>
        {[4, 3, 2].map(r => (
          <label key={r} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === r}
              onChange={() =>
                setFilters(prev => ({ ...prev, minRating: r }))
              }
              className="accent-[#6b5d52]"
            />
            {r}★ & above
          </label>
        ))}
      </div>

      {/* DISCOUNT */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-[#6b5d52]">
          Discount
        </h4>
        {[10, 20, 30, 40, 50].map(d => (
          <label key={d} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="discount"
              checked={filters.minDiscount === d}
              onChange={() =>
                setFilters(prev => ({ ...prev, minDiscount: d }))
              }
              className="accent-[#6b5d52]"
            />
            {d}% or more
          </label>
        ))}
      </div>

      {/* CLEAR */}
      <button
        onClick={() =>
          setFilters({
            categories: [],
            maxPrice: 100000,
            minRating: 0,
            minDiscount: 0,
          })
        }
        className="w-full text-sm text-[#6b5d52] border border-[#ede6dd] rounded-md py-2 hover:bg-[#ede6dd]"
      >
        Clear All Filters
      </button>
    </aside>
  )
}
