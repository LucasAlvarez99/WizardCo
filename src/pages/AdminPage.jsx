/* ============================================================================
   AdminPage.jsx — Panel de administración (solo para usuarios con isAdmin).
   Tip de demo: registrate/ingresá con un email que contenga "admin"
   (ej: admin@wizardco.com) para entrar como administrador.
============================================================================ */

const ADMIN_TABS = [
  { id: "products", label: "Productos", icon: "package" },
  { id: "coupons", label: "Cupones", icon: "tag" },
  { id: "orders", label: "Pedidos", icon: "clipboard" },
  { id: "settings", label: "Configuración", icon: "cog" },
];

function AdminPage({ onBack }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("products");

  if (!user || !user.isAdmin) {
    return (
      <div className="admin-denied">
        <IconShield size={40} strokeWidth={1.2} />
        <h2>No autorizado</h2>
        <p>Necesitás una cuenta de administrador para ver esta página.</p>
        <button className="back-link" onClick={onBack}><IconChevronLeft size={16} /> Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <button className="back-link" onClick={onBack}>
        <IconChevronLeft size={16} /> Volver al catálogo
      </button>

      <div className="admin-header">
        <h1 className="checkout-title"><IconStore size={20} /> Panel de administración</h1>
        <p className="admin-subtitle">Gestioná productos, cupones, pedidos y el aviso de venta.</p>
      </div>

      <div className="admin-tabs">
        {ADMIN_TABS.map((t) => (
          <button
            key={t.id}
            className={`admin-tab-btn ${tab === t.id ? "admin-tab-btn--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" && <ProductsTab />}
      {tab === "coupons" && <CouponsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}
