/* ============================================================================
   CartDrawer.jsx
============================================================================ */

function CartDrawer({
  onClose,
  onCheckout
}) {
  const {
    items,
    removeFromCart,
    updateQty,
    totals
  } = useCart();
  return /*#__PURE__*/React.createElement("div", {
    className: "cart-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cart-overlay__backdrop",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "cart-drawer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cart-drawer__header"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(IconCart, {
    size: 18
  }), " Tu carrito"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconX, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cart-drawer__body"
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "cart-empty"
  }, /*#__PURE__*/React.createElement(IconPackage, {
    size: 40,
    strokeWidth: 1.2
  }), /*#__PURE__*/React.createElement("p", null, "Todav\xEDa no agregaste productos.")) : /*#__PURE__*/React.createElement("ul", null, items.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.id,
    className: "cart-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cart-item__thumb"
  }, /*#__PURE__*/React.createElement(IconPrinter, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "cart-item__info"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cart-item__name line-clamp-2"
  }, item.name), /*#__PURE__*/React.createElement("p", {
    className: "cart-item__material"
  }, item.material), /*#__PURE__*/React.createElement("div", {
    className: "cart-item__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qty-control"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qty-btn",
    onClick: () => updateQty(item.id, -1)
  }, /*#__PURE__*/React.createElement(IconMinus, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "qty-value"
  }, item.qty), /*#__PURE__*/React.createElement("button", {
    className: "qty-btn",
    onClick: () => updateQty(item.id, 1)
  }, /*#__PURE__*/React.createElement(IconPlus, {
    size: 14
  }))), /*#__PURE__*/React.createElement("span", {
    className: "cart-item__price"
  }, formatCurrency(item.price * item.qty)))), /*#__PURE__*/React.createElement("button", {
    className: "cart-item__remove",
    onClick: () => removeFromCart(item.id),
    "aria-label": "Eliminar"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    size: 16
  })))))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cart-drawer__footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cart-subtotal-row"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, formatCurrency(totals.subtotal))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: onCheckout
  }, /*#__PURE__*/React.createElement(IconCard, {
    size: 16
  }), " Ir a pagar"))));
}
