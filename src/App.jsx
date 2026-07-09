/* ============================================================================
   App.jsx — Raíz de la aplicación
============================================================================ */

function AppShell() {
  const [view, setView] = useState("catalog"); // "catalog" | "checkout" | "profile" | "admin"
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: new Set(),
    materials: new Set(),
    fileTypes: new Set(),
    minPrice: "",
    maxPrice: "",
  });

  const handleSelectCategory = (categoryId) => {
    setView("catalog");
    setFilters((prev) => {
      const alreadyOnly = prev.categories.size === 1 && prev.categories.has(categoryId);
      return { ...prev, categories: alreadyOnly ? new Set() : new Set([categoryId]) };
    });
  };

  return (
    <div className="app-shell">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenFilters={() => setFiltersOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={handleSelectCategory}
        onGoProfile={() => setView("profile")}
        onGoAdmin={() => setView("admin")}
      />

      {view === "catalog" && (
        <CatalogPage
          searchQuery={searchQuery}
          filters={filters}
          setFilters={setFilters}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />
      )}

      {view === "checkout" && (
        <CheckoutView
          onBack={() => setView("catalog")}
          onFinish={() => setView("catalog")}
          onGoProfile={() => setView("profile")}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      {view === "profile" && <ProfilePage onBack={() => setView("catalog")} />}

      {view === "admin" && <AdminPage onBack={() => setView("catalog")} />}

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setView("checkout");
          }}
        />
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <AdminDataProvider>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </AdminDataProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
