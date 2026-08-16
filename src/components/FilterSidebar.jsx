/* ============================================================================
   FilterSidebar.jsx
============================================================================ */

function FilterSidebar({ filters, setFilters, isOpen, onClose, resultCount }) {
  const toggleSetValue = (key, value) => {
    setFilters((prev) => {
      const set = new Set(prev[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [key]: set };
    });
  };

  const clearAll = () =>
    setFilters({ categories: new Set(), materials: new Set(), fileTypes: new Set(), minPrice: "", maxPrice: "" });

  const FilterContent = () => (
    <React.Fragment>
      <div className="filters-card__title-row">
        <h3 className="filters-card__title">Filtros</h3>
        <button className="filters-clear" onClick={clearAll}>Limpiar todo</button>
      </div>

      <div className="filter-group">
        <p className="filter-group__title">Categoría</p>
        {CATEGORIES.map((cat) => (
          <label key={cat.id} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.categories.has(cat.id)}
              onChange={() => toggleSetValue("categories", cat.id)}
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-group__title">Rango de precio (ARS)</p>
        <div className="price-range">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="filter-group">
        <p className="filter-group__title">Material</p>
        {MATERIALS.map((mat) => (
          <label key={mat} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.materials.has(mat)}
              onChange={() => toggleSetValue("materials", mat)}
            />
            <span>{mat}</span>
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-group__title">Tipo de artículo</p>
        {FILE_TYPES.map((ft) => (
          <label key={ft.id} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.fileTypes.has(ft.id)}
              onChange={() => toggleSetValue("fileTypes", ft.id)}
            />
            <span>{ft.label}</span>
          </label>
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {/* Desktop: sidebar fijo */}
      <aside className="filters-panel-desktop">
        <div className="filters-card">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile/tablet: panel deslizante */}
      {isOpen && (
        <div className="filters-overlay">
          <div className="filters-overlay__backdrop" onClick={onClose} />
          <div className="filters-drawer">
            <div className="filters-drawer__top">
              <span className="filters-drawer__count">{resultCount} resultados</span>
              <button onClick={onClose}><IconX size={20} /></button>
            </div>
            <FilterContent />
            <button className="filters-apply-btn" onClick={onClose}>
              Ver {resultCount} resultados
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
