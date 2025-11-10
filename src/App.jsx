import { useEffect, useMemo, useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [colorFilter, setColorFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const res = await fetch('/images/catalog.json')
        if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`)
        const data = await res.json()
        if (isMounted) setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        if (isMounted) setError(e?.message || 'Failed to load images')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const colors = useMemo(() => {
    return Array.from(new Set(items.map(i => i.color))).sort()
  }, [items])

  const sizes = useMemo(() => {
    return Array.from(new Set(items.map(i => i.size)))
  }, [items])

  const filtered = useMemo(() => {
    return items.filter(i => {
      const colorOk = !colorFilter || i.color === colorFilter
      const sizeOk = !sizeFilter || i.size === sizeFilter
      return colorOk && sizeOk
    })
  }, [items, colorFilter, sizeFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Image Catalog</h1>
            <p className="text-sm text-gray-500">Filter by color and size. Images loaded from <code>/images/catalog.json</code>.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <label htmlFor="color" className="text-sm font-medium text-gray-700">Color</label>
              <select
                id="color"
                className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={colorFilter}
                onChange={e => setColorFilter(e.target.value)}
              >
                <option value="">All</option>
                {colors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="size" className="text-sm font-medium text-gray-700">Size</label>
              <select
                id="size"
                className="mt-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={sizeFilter}
                onChange={e => setSizeFilter(e.target.value)}
              >
                <option value="">All</option>
                {sizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {(colorFilter || sizeFilter) && (
              <button
                type="button"
                onClick={() => { setColorFilter(''); setSizeFilter('') }}
                className="mt-5 inline-flex h-9 items-center rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 hover:bg-gray-200 sm:mt-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center text-gray-500">Loading images…</div>
        )}
        {!!error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const src = `/images/${item.title}`
            const alt = `${item.title} — ${item.color} — ${item.size}`
            return (
              <figure key={item.title} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[4/3] w-full bg-gray-100">
                  <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-3">
                  <div className="truncate text-sm font-medium text-gray-900" title={item.title}>{item.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">{item.color}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 font-medium text-gray-700 ring-1 ring-inset ring-gray-200">{item.size}</span>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-500">No images match the current filters.</div>
        )}
      </div>
    </div>
  )
}

export default App
