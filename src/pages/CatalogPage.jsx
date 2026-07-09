/* ============================================================================
   CatalogPage.jsx
============================================================================ */

function CatalogPage({ searchQuery, filters, setFilters, filtersOpen, setFiltersOpen }) {
  const { addToCart } = useCart();
  const { products } = useAdminData();
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.categories.size > 0 && !filters.categories.has(p.category)) return false;
      if (filters.materials.size > 0 && !filters.materials.has(p.material)) return false;
      if (filters.fileTypes.size > 0 && !filters.fileTypes.has(p.fileType)) return false;
      const finalPrice = priceWithDiscount(p);
      if (filters.minPrice && finalPrice < Number(filters.minPrice)) return false;
      if (filters.maxPrice && finalPrice > Number(filters.maxPrice)) return false;
      return true;
    });

    if (sortBy === "price_asc") list = [...list].sort((a, b) => priceWithDiscount(a) - priceWithDiscount(b));
    if (sortBy === "price_desc") list = [...list].sort((a, b) => priceWithDiscount(b) - priceWithDiscount(a));
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, searchQuery, filters, sortBy]);

  const activeCategoryLabel =
    filters.categories.size === 1 ? CATEGORIES.find((c) => c.id === [...filters.categories][0])?.label : null;

  return (
    <div className="catalog-layout">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        resultCount={filtered.length}
      />

      <div className="catalog-main">
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">
              {activeCategoryLabel || (searchQuery ? `Resultados para "${searchQuery}"` : "Todos los productos")}
            </h1>
            <p className="catalog-count">{filtered.length} publicaciones</p>
          </div>

          <div className="catalog-controls">
            <button className="mobile-filter-btn" onClick={() => setFiltersOpen(true)}>
              <IconSliders size={15} /> Filtros
            </button>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Más relevantes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <IconPackage size={40} strokeWidth={1.2} />
            <p>No encontramos publicaciones con esos filtros.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
