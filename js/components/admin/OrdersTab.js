/* src/components/admin/OrdersTab.jsx */

function paymentStatusLabel(status) {
  switch (status) {
    case "approved":
      return "Pagado";
    case "pending":
      return "Pendiente";
    case "pending_payment":
      return "Esperando pago";
    case "rejected":
      return "Rechazado";
    default:
      return status;
  }
}
function buildOrderMessage(order) {
  const lines = order.items.map(i => `• ${i.qty}x ${i.name} — ${formatCurrency(i.price * i.qty)}`).join("\n");
  return `Nuevo pedido ${order.id}\nCliente: ${order.customerName} (${order.customerEmail})\n\n${lines}\n\nTotal: ${formatCurrency(order.total)}${order.couponCode ? `\nCupón usado: ${order.couponCode}` : ""}`;
}
function OrdersTab() {
  const {
    orders,
    ordersLoading,
    ordersError,
    contact
  } = useAdminData();
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-tab admin-tab--single"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-card admin-card--wide"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    size: 16
  }), " Pedidos confirmados (", orders.length, ")"), ordersError && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", ordersError), ordersLoading ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "Cargando pedidos...") : orders.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "Todav\xEDa no hay pedidos confirmados.") : /*#__PURE__*/React.createElement("ul", {
    className: "admin-orders-list"
  }, orders.map(order => {
    const message = buildOrderMessage(order);
    const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent(`Pedido ${order.id} — WizardCo`)}&body=${encodeURIComponent(message)}`;
    return /*#__PURE__*/React.createElement("li", {
      key: order.id,
      className: "admin-order-item"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "admin-order-item__id"
    }, order.id, order.paymentStatus && /*#__PURE__*/React.createElement("span", {
      className: `payment-status-badge payment-status-badge--${order.paymentStatus}`
    }, paymentStatusLabel(order.paymentStatus))), /*#__PURE__*/React.createElement("p", {
      className: "admin-order-item__meta"
    }, order.customerName, " \xB7 ", order.customerEmail, " \xB7 ", new Date(order.date).toLocaleString("es-AR"))), /*#__PURE__*/React.createElement("div", {
      className: "admin-order-item__total"
    }, formatCurrency(order.total)), /*#__PURE__*/React.createElement("div", {
      className: "admin-order-item__actions"
    }, /*#__PURE__*/React.createElement("a", {
      className: "admin-notify-btn admin-notify-btn--wa",
      href: waLink,
      target: "_blank",
      rel: "noreferrer"
    }, /*#__PURE__*/React.createElement(IconMessageCircle, {
      size: 14
    }), " WhatsApp"), /*#__PURE__*/React.createElement("a", {
      className: "admin-notify-btn admin-notify-btn--mail",
      href: mailLink
    }, /*#__PURE__*/React.createElement(IconMail, {
      size: 14
    }), " Email")));
  }))));
}
