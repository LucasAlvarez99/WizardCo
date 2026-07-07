/* ============================================================================
   CatalogPage.jsx
============================================================================ */

function CatalogPage({
  searchQuery,
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen
}) {
  const {
    addToCart
  } = useCart();
  const [sortBy, setSortBy] = useState("relevance");
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
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
  }, [searchQuery, filters, sortBy]);
  const activeCategoryLabel = filters.categories.size === 1 ? CATEGORIES.find(c => c.id === [...filters.categories][0])?.label : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "catalog-layout"
  }, /*#__PURE__*/React.createElement(FilterSidebar, {
    filters: filters,
    setFilters: setFilters,
    isOpen: filtersOpen,
    onClose: () => setFiltersOpen(false),
    resultCount: filtered.length
  }), /*#__PURE__*/React.createElement("div", {
    className: "catalog-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "catalog-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "catalog-title"
  }, activeCategoryLabel || (searchQuery ? `Resultados para "${searchQuery}"` : "Todos los productos")), /*#__PURE__*/React.createElement("p", {
    className: "catalog-count"
  }, filtered.length, " publicaciones")), /*#__PURE__*/React.createElement("div", {
    className: "catalog-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mobile-filter-btn",
    onClick: () => setFiltersOpen(true)
  }, /*#__PURE__*/React.createElement(IconSliders, {
    size: 15
  }), " Filtros"), /*#__PURE__*/React.createElement("select", {
    className: "sort-select",
    value: sortBy,
    onChange: e => setSortBy(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "relevance"
  }, "M\xE1s relevantes"), /*#__PURE__*/React.createElement("option", {
    value: "price_asc"
  }, "Menor precio"), /*#__PURE__*/React.createElement("option", {
    value: "price_desc"
  }, "Mayor precio"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "Mejor calificados")))), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(IconPackage, {
    size: 40,
    strokeWidth: 1.2
  }), /*#__PURE__*/React.createElement("p", null, "No encontramos publicaciones con esos filtros.")) : /*#__PURE__*/React.createElement("div", {
    className: "product-grid"
  }, filtered.map(product => /*#__PURE__*/React.createElement(ProductCard, {
    key: product.id,
    product: product,
    onAdd: addToCart
  })))));
}
