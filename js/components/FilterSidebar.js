/* ============================================================================
   FilterSidebar.jsx
============================================================================ */

function FilterSidebar({
  filters,
  setFilters,
  isOpen,
  onClose,
  resultCount
}) {
  const toggleSetValue = (key, value) => {
    setFilters(prev => {
      const set = new Set(prev[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return {
        ...prev,
        [key]: set
      };
    });
  };
  const clearAll = () => setFilters({
    categories: new Set(),
    materials: new Set(),
    fileTypes: new Set(),
    minPrice: "",
    maxPrice: ""
  });
  const FilterContent = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filters-card__title-row"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "filters-card__title"
  }, "Filtros"), /*#__PURE__*/React.createElement("button", {
    className: "filters-clear",
    onClick: clearAll
  }, "Limpiar todo")), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "filter-group__title"
  }, "Categor\xEDa"), CATEGORIES.map(cat => /*#__PURE__*/React.createElement("label", {
    key: cat.id,
    className: "filter-checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: filters.categories.has(cat.id),
    onChange: () => toggleSetValue("categories", cat.id)
  }), /*#__PURE__*/React.createElement("span", null, cat.label)))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "filter-group__title"
  }, "Rango de precio (ARS)"), /*#__PURE__*/React.createElement("div", {
    className: "price-range"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "M\xEDn",
    value: filters.minPrice,
    onChange: e => setFilters(p => ({
      ...p,
      minPrice: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("span", null, "\u2013"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "M\xE1x",
    value: filters.maxPrice,
    onChange: e => setFilters(p => ({
      ...p,
      maxPrice: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "filter-group__title"
  }, "Material"), MATERIALS.map(mat => /*#__PURE__*/React.createElement("label", {
    key: mat,
    className: "filter-checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: filters.materials.has(mat),
    onChange: () => toggleSetValue("materials", mat)
  }), /*#__PURE__*/React.createElement("span", null, mat)))), /*#__PURE__*/React.createElement("div", {
    className: "filter-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "filter-group__title"
  }, "Tipo de art\xEDculo"), FILE_TYPES.map(ft => /*#__PURE__*/React.createElement("label", {
    key: ft.id,
    className: "filter-checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: filters.fileTypes.has(ft.id),
    onChange: () => toggleSetValue("fileTypes", ft.id)
  }), /*#__PURE__*/React.createElement("span", null, ft.label)))));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("aside", {
    className: "filters-panel-desktop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-card"
  }, /*#__PURE__*/React.createElement(FilterContent, null))), isOpen && /*#__PURE__*/React.createElement("div", {
    className: "filters-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-overlay__backdrop",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "filters-drawer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-drawer__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "filters-drawer__count"
  }, resultCount, " resultados"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconX, {
    size: 20
  }))), /*#__PURE__*/React.createElement(FilterContent, null), /*#__PURE__*/React.createElement("button", {
    className: "filters-apply-btn",
    onClick: onClose
  }, "Ver ", resultCount, " resultados"))));
}
