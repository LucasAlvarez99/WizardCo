/* src/components/profile/OrderHistoryCard.jsx */

function OrderHistoryCard() {
  const {
    user
  } = useAuth();
  const {
    orders
  } = useAdminData();
  const myOrders = orders.filter(o => o.customerEmail === user.email);
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-card profile-card--block"
  }, /*#__PURE__*/React.createElement("p", {
    className: "profile-card__title"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    size: 16
  }), " Mis pedidos (", myOrders.length, ")"), myOrders.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "Todav\xEDa no hiciste ninguna compra.") : /*#__PURE__*/React.createElement("ul", {
    className: "admin-orders-list"
  }, myOrders.map(order => /*#__PURE__*/React.createElement("li", {
    key: order.id,
    className: "admin-order-item"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "admin-order-item__id"
  }, order.id), /*#__PURE__*/React.createElement("p", {
    className: "admin-order-item__meta"
  }, new Date(order.date).toLocaleString("es-AR"), " \xB7 ", order.items.length, " producto(s)")), /*#__PURE__*/React.createElement("div", {
    className: "admin-order-item__total"
  }, formatCurrency(order.total))))));
}
