/* ============================================================================
   Header.jsx
============================================================================ */

function Header({
  onOpenCart,
  onOpenLogin,
  onOpenFilters,
  searchQuery,
  setSearchQuery,
  onSelectCategory
}) {
  const {
    user,
    logout
  } = useAuth();
  const {
    totals
  } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-header__top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn icon-btn--menu",
    onClick: () => setCategoryMenuOpen(v => !v),
    "aria-label": "Abrir men\xFA de categor\xEDas"
  }, /*#__PURE__*/React.createElement(IconMenu, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand__icon"
  }, /*#__PURE__*/React.createElement(IconLayers, {
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "brand__name"
  }, "Voxel", /*#__PURE__*/React.createElement("span", {
    className: "brand__accent"
  }, "Market"))), /*#__PURE__*/React.createElement("div", {
    className: "search-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-bar__wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    placeholder: "Buscar dise\xF1os, figuras, repuestos 3D...",
    className: "search-bar__input"
  }), /*#__PURE__*/React.createElement(IconSearch, {
    size: 18,
    className: "search-bar__icon"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "header-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn mobile-search-btn",
    onClick: () => setMobileSearchOpen(v => !v),
    "aria-label": "Buscar"
  }, /*#__PURE__*/React.createElement(IconSearch, {
    size: 20
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn filters-toggle-desktop",
    onClick: onOpenFilters
  }, /*#__PURE__*/React.createElement(IconSliders, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    className: "icon-btn__label"
  }, "Filtros")), user ? /*#__PURE__*/React.createElement("div", {
    className: "user-menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "user-menu__trigger",
    onClick: () => setUserMenuOpen(v => !v)
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-avatar"
  }, user.name.charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "user-menu__name"
  }, user.name), /*#__PURE__*/React.createElement(IconChevronDown, {
    size: 14
  })), userMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "user-menu__dropdown"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-menu__header"
  }, /*#__PURE__*/React.createElement("p", {
    className: "user-menu__fullname"
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "user-menu__email"
  }, user.email)), /*#__PURE__*/React.createElement("div", {
    className: "user-menu__item"
  }, /*#__PURE__*/React.createElement(IconPackage, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, user.orders, " compras realizadas")), /*#__PURE__*/React.createElement("button", {
    className: "user-menu__logout",
    onClick: () => {
      logout();
      setUserMenuOpen(false);
    }
  }, /*#__PURE__*/React.createElement(IconLogout, {
    size: 15
  }), " Cerrar sesi\xF3n"))) : /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: onOpenLogin
  }, /*#__PURE__*/React.createElement(IconUser, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "icon-btn__label"
  }, "Ingresar")), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn cart-btn",
    onClick: onOpenCart,
    "aria-label": "Abrir carrito"
  }, /*#__PURE__*/React.createElement(IconCart, {
    size: 20
  }), totals.itemCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "cart-badge"
  }, totals.itemCount)))), mobileSearchOpen && /*#__PURE__*/React.createElement("div", {
    className: "mobile-search"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-bar__wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    autoFocus: true,
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    placeholder: "Buscar dise\xF1os, figuras, repuestos 3D...",
    className: "search-bar__input"
  }), /*#__PURE__*/React.createElement(IconSearch, {
    size: 18,
    className: "search-bar__icon"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: `category-nav ${categoryMenuOpen ? "category-nav--open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "category-nav__list"
  }, CATEGORIES.map(cat => {
    const Icon = CATEGORY_ICONS[cat.icon];
    return /*#__PURE__*/React.createElement("button", {
      key: cat.id,
      className: "category-link",
      onClick: () => {
        setCategoryMenuOpen(false);
        onSelectCategory(cat.id);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 16
    }), cat.label);
  }))));
}
