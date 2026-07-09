/* ============================================================================
   AdminPage.jsx — Panel de administración (solo para usuarios con isAdmin).
   Tip de demo: registrate/ingresá con un email que contenga "admin"
   (ej: admin@wizardco.com) para entrar como administrador.
============================================================================ */

const ADMIN_TABS = [{
  id: "products",
  label: "Productos",
  icon: "package"
}, {
  id: "coupons",
  label: "Cupones",
  icon: "tag"
}, {
  id: "orders",
  label: "Pedidos",
  icon: "clipboard"
}, {
  id: "settings",
  label: "Configuración",
  icon: "cog"
}];
function AdminPage({
  onBack
}) {
  const {
    user
  } = useAuth();
  const [tab, setTab] = useState("products");
  if (!user || !user.isAdmin) {
    return /*#__PURE__*/React.createElement("div", {
      className: "admin-denied"
    }, /*#__PURE__*/React.createElement(IconShield, {
      size: 40,
      strokeWidth: 1.2
    }), /*#__PURE__*/React.createElement("h2", null, "No autorizado"), /*#__PURE__*/React.createElement("p", null, "Necesit\xE1s una cuenta de administrador para ver esta p\xE1gina."), /*#__PURE__*/React.createElement("button", {
      className: "back-link",
      onClick: onBack
    }, /*#__PURE__*/React.createElement(IconChevronLeft, {
      size: 16
    }), " Volver al cat\xE1logo"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-page"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconChevronLeft, {
    size: 16
  }), " Volver al cat\xE1logo"), /*#__PURE__*/React.createElement("div", {
    className: "admin-header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "checkout-title"
  }, /*#__PURE__*/React.createElement(IconStore, {
    size: 20
  }), " Panel de administraci\xF3n"), /*#__PURE__*/React.createElement("p", {
    className: "admin-subtitle"
  }, "Gestion\xE1 productos, cupones, pedidos y el aviso de venta.")), /*#__PURE__*/React.createElement("div", {
    className: "admin-tabs"
  }, ADMIN_TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `admin-tab-btn ${tab === t.id ? "admin-tab-btn--active" : ""}`,
    onClick: () => setTab(t.id)
  }, t.label))), tab === "products" && /*#__PURE__*/React.createElement(ProductsTab, null), tab === "coupons" && /*#__PURE__*/React.createElement(CouponsTab, null), tab === "orders" && /*#__PURE__*/React.createElement(OrdersTab, null), tab === "settings" && /*#__PURE__*/React.createElement(SettingsTab, null));
}
