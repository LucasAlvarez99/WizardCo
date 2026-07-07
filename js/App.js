/* ============================================================================
   App.jsx — Raíz de la aplicación
============================================================================ */

function AppShell() {
  const [view, setView] = useState("catalog"); // "catalog" | "checkout"
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: new Set(),
    materials: new Set(),
    fileTypes: new Set(),
    minPrice: "",
    maxPrice: ""
  });
  const handleSelectCategory = categoryId => {
    setView("catalog");
    setFilters(prev => {
      const alreadyOnly = prev.categories.size === 1 && prev.categories.has(categoryId);
      return {
        ...prev,
        categories: alreadyOnly ? new Set() : new Set([categoryId])
      };
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(Header, {
    onOpenCart: () => setCartOpen(true),
    onOpenLogin: () => setLoginOpen(true),
    onOpenFilters: () => setFiltersOpen(true),
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery,
    onSelectCategory: handleSelectCategory
  }), view === "catalog" ? /*#__PURE__*/React.createElement(CatalogPage, {
    searchQuery: searchQuery,
    filters: filters,
    setFilters: setFilters,
    filtersOpen: filtersOpen,
    setFiltersOpen: setFiltersOpen
  }) : /*#__PURE__*/React.createElement(CheckoutView, {
    onBack: () => setView("catalog"),
    onFinish: () => setView("catalog")
  }), cartOpen && /*#__PURE__*/React.createElement(CartDrawer, {
    onClose: () => setCartOpen(false),
    onCheckout: () => {
      setCartOpen(false);
      setView("checkout");
    }
  }), loginOpen && /*#__PURE__*/React.createElement(LoginModal, {
    onClose: () => setLoginOpen(false)
  }));
}
function App() {
  return /*#__PURE__*/React.createElement(AuthProvider, null, /*#__PURE__*/React.createElement(CartProvider, null, /*#__PURE__*/React.createElement(AppShell, null)));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
