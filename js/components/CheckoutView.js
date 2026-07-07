/* ============================================================================
   CheckoutView.jsx — usa CouponManager vía useCart()
============================================================================ */

function CheckoutView({
  onBack,
  onFinish
}) {
  const {
    items,
    totals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setCouponMessage(result);
    if (result.success) setCouponInput("");
  };
  const handleConfirm = () => {
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      setOrderDone(true);
      setTimeout(() => {
        clearCart();
        onFinish();
      }, 1800);
    }, 900);
  };
  if (orderDone) {
    return /*#__PURE__*/React.createElement("div", {
      className: "order-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "order-success__icon"
    }, /*#__PURE__*/React.createElement(IconCheck, {
      size: 32
    })), /*#__PURE__*/React.createElement("h2", null, "\xA1Compra confirmada!"), /*#__PURE__*/React.createElement("p", null, "Te enviamos el comprobante por email. Gracias por elegir WizardCo."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "checkout-page"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconChevronLeft, {
    size: 16
  }), " Volver al cat\xE1logo"), /*#__PURE__*/React.createElement("h1", {
    className: "checkout-title"
  }, "Finalizar compra"), /*#__PURE__*/React.createElement("div", {
    className: "checkout-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "order-summary-title"
  }, "Resumen del pedido"), items.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "order-item"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "order-item__name"
  }, item.name), /*#__PURE__*/React.createElement("p", {
    className: "order-item__meta"
  }, "Cantidad: ", item.qty, " \xB7 ", item.material)), /*#__PURE__*/React.createElement("span", {
    className: "order-item__price"
  }, formatCurrency(item.price * item.qty))))), /*#__PURE__*/React.createElement("div", {
    className: "checkout-summary-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "coupon-label"
  }, /*#__PURE__*/React.createElement(IconTag, {
    size: 13
  }), " Cup\xF3n de descuento"), appliedCoupon ? /*#__PURE__*/React.createElement("div", {
    className: "coupon-applied"
  }, /*#__PURE__*/React.createElement("span", null, appliedCoupon.code, " \xB7 -", appliedCoupon.discountPercentage, "%"), /*#__PURE__*/React.createElement("button", {
    onClick: removeCoupon
  }, /*#__PURE__*/React.createElement(IconX, {
    size: 15
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "coupon-input-row"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: couponInput,
    onChange: e => setCouponInput(e.target.value),
    placeholder: "Ej: DESCUENTO3D"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleApplyCoupon
  }, "Aplicar")), couponMessage && /*#__PURE__*/React.createElement("p", {
    className: `coupon-message ${couponMessage.success ? "coupon-message--success" : "coupon-message--error"}`
  }, couponMessage.success ? /*#__PURE__*/React.createElement(IconCheck, {
    size: 13
  }) : /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), couponMessage.message)), /*#__PURE__*/React.createElement("div", {
    className: "totals-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "totals-row"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, formatCurrency(totals.subtotal))), totals.discountAmount > 0 && /*#__PURE__*/React.createElement("div", {
    className: "totals-row totals-row--discount"
  }, /*#__PURE__*/React.createElement("span", null, "Descuento"), /*#__PURE__*/React.createElement("span", null, "-", formatCurrency(totals.discountAmount))), /*#__PURE__*/React.createElement("div", {
    className: "totals-row"
  }, /*#__PURE__*/React.createElement("span", null, "IVA (21%)"), /*#__PURE__*/React.createElement("span", null, formatCurrency(totals.tax))), /*#__PURE__*/React.createElement("div", {
    className: "totals-row totals-row--final"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, formatCurrency(totals.total)))), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: handleConfirm,
    disabled: placingOrder || items.length === 0
  }, placingOrder ? /*#__PURE__*/React.createElement(IconLoader, {
    size: 16
  }) : /*#__PURE__*/React.createElement(IconBadgeCheck, {
    size: 16
  }), placingOrder ? "Procesando..." : "Confirmar compra"))));
}
