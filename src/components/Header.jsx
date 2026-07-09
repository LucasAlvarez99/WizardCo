/* ============================================================================
   Header.jsx
============================================================================ */

function Header({ onOpenCart, onOpenLogin, onOpenFilters, searchQuery, setSearchQuery, onSelectCategory, onGoProfile, onGoAdmin }) {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__top">
        <button
          className="icon-btn icon-btn--menu"
          onClick={() => setCategoryMenuOpen((v) => !v)}
          aria-label="Abrir menú de categorías"
        >
          <IconMenu size={24} />
        </button>

        <div className="brand">
          <div className="brand__icon"><IconWizardHat size={22} /></div>
          <span className="brand__name">
            <span className="brand__wizard">Wizard</span><span className="brand__accent">Co</span>
          </span>
        </div>

        <div className="search-bar">
          <div className="search-bar__wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar diseños, figuras, repuestos 3D..."
              className="search-bar__input"
            />
            <IconSearch size={18} className="search-bar__icon" />
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn mobile-search-btn" onClick={() => setMobileSearchOpen((v) => !v)} aria-label="Buscar">
            <IconSearch size={20} />
          </button>

          <button className="icon-btn filters-toggle-desktop" onClick={onOpenFilters}>
            <IconSliders size={18} />
            <span className="icon-btn__label">Filtros</span>
          </button>

          {user ? (
            <div className="user-menu">
              <button className="user-menu__trigger" onClick={() => setUserMenuOpen((v) => !v)}>
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-menu__name">{user.name}</span>
                <IconChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className="user-menu__dropdown">
                  <div className="user-menu__header">
                    <p className="user-menu__fullname">{user.name}</p>
                    <p className="user-menu__email">{user.email}</p>
                    {!user.verified && (
                      <p className="user-menu__unverified"><IconAlert size={12} /> Cuenta sin verificar</p>
                    )}
                  </div>
                  <button
                    className="user-menu__item user-menu__item--btn"
                    onClick={() => {
                      onGoProfile();
                      setUserMenuOpen(false);
                    }}
                  >
                    <IconUser size={15} />
                    <span>Mi perfil</span>
                  </button>
                  {user.isAdmin && (
                    <button
                      className="user-menu__item user-menu__item--btn"
                      onClick={() => {
                        onGoAdmin();
                        setUserMenuOpen(false);
                      }}
                    >
                      <IconStore size={15} />
                      <span>Panel de administración</span>
                    </button>
                  )}
                  <button
                    className="user-menu__logout"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <IconLogout size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="icon-btn" onClick={onOpenLogin}>
              <IconUser size={20} />
              <span className="icon-btn__label">Ingresar</span>
            </button>
          )}

          <button className="icon-btn cart-btn" onClick={onOpenCart} aria-label="Abrir carrito">
            <IconCart size={20} />
            {totals.itemCount > 0 && <span className="cart-badge">{totals.itemCount}</span>}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="mobile-search">
          <div className="search-bar__wrap">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar diseños, figuras, repuestos 3D..."
              className="search-bar__input"
            />
            <IconSearch size={18} className="search-bar__icon" />
          </div>
        </div>
      )}

      <nav className={`category-nav ${categoryMenuOpen ? "category-nav--open" : ""}`}>
        <div className="category-nav__list">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            return (
              <button
                key={cat.id}
                className="category-link"
                onClick={() => {
                  setCategoryMenuOpen(false);
                  onSelectCategory(cat.id);
                }}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
