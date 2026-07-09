/* ============================================================================
   CheckoutView.jsx — usa CouponManager vía useCart(), valida cuenta
   verificada + cuenta bancaria vinculada, registra el pedido en
   AdminDataContext y ofrece avisar la venta por WhatsApp/Email.
============================================================================ */

function CheckoutView({
  onBack,
  onFinish,
  onGoProfile,
  onOpenLogin
}) {
  const {
    user
  } = useAuth();
  const {
    items,
    totals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();
  const {
    logOrder,
    contact
  } = useAdminData();
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setCouponMessage(result);
    if (result.success) setCouponInput("");
  };

  // Validaciones antes de permitir confirmar la compra.
  const blockers = [];
  if (!user) blockers.push({
    text: "Tenés que iniciar sesión para comprar.",
    action: onOpenLogin,
    actionLabel: "Ingresar"
  });
  if (user && !user.verified) blockers.push({
    text: "Tu cuenta todavía no está verificada.",
    action: onGoProfile,
    actionLabel: "Verificar cuenta"
  });
  if (user && !user.bankAccount) blockers.push({
    text: "Necesitás vincular una cuenta bancaria para validar la compra.",
    action: onGoProfile,
    actionLabel: "Vincular cuenta"
  });
  const handleConfirm = () => {
    if (blockers.length > 0 || items.length === 0) return;
    setPlacingOrder(true);
    setTimeout(() => {
      const order = {
        customerName: user.name,
        customerEmail: user.email,
        items: items.map(i => ({
          name: i.name,
          qty: i.qty,
          price: i.price
        })),
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        tax: totals.tax,
        total: totals.total,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };
      logOrder(order);
      setLastOrder(order);
      setPlacingOrder(false);
      setOrderDone(true);
      clearCart();
    }, 900);
  };
  if (orderDone) {
    const message = `Nuevo pedido confirmado\nCliente: ${lastOrder.customerName} (${lastOrder.customerEmail})\n\n${lastOrder.items.map(i => `• ${i.qty}x ${i.name}`).join("\n")}\n\nTotal: ${formatCurrency(lastOrder.total)}`;
    const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent("Nuevo pedido — WizardCo")}&body=${encodeURIComponent(message)}`;
    return /*#__PURE__*/React.createElement("div", {
      className: "order-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "order-success__icon"
    }, /*#__PURE__*/React.createElement(IconCheck, {
      size: 32
    })), /*#__PURE__*/React.createElement("h2", null, "\xA1Compra confirmada!"), /*#__PURE__*/React.createElement("p", null, "Gracias por elegir WizardCo, ", lastOrder.customerName.split(" ")[0], "."), /*#__PURE__*/React.createElement("div", {
      className: "order-success__notify"
    }, /*#__PURE__*/React.createElement("p", {
      className: "order-success__notify-label"
    }, "Avisar la venta al equipo de WizardCo:"), /*#__PURE__*/React.createElement("div", {
      className: "order-success__notify-actions"
    }, /*#__PURE__*/React.createElement("a", {
      className: "admin-notify-btn admin-notify-btn--wa",
      href: waLink,
      target: "_blank",
      rel: "noreferrer"
    }, /*#__PURE__*/React.createElement(IconMessageCircle, {
      size: 15
    }), " Enviar por WhatsApp"), /*#__PURE__*/React.createElement("a", {
      className: "admin-notify-btn admin-notify-btn--mail",
      href: mailLink
    }, /*#__PURE__*/React.createElement(IconMail, {
      size: 15
    }), " Enviar por Email"))), /*#__PURE__*/React.createElement("button", {
      className: "back-link",
      style: {
        marginTop: 24
      },
      onClick: onFinish
    }, /*#__PURE__*/React.createElement(IconChevronLeft, {
      size: 16
    }), " Volver al cat\xE1logo"));
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
  }, "Finalizar compra"), blockers.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "checkout-blockers"
  }, blockers.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "checkout-blocker"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, b.text), b.action && /*#__PURE__*/React.createElement("button", {
    className: "checkout-blocker__action",
    onClick: b.action
  }, b.actionLabel)))), /*#__PURE__*/React.createElement("div", {
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
    disabled: placingOrder || items.length === 0 || blockers.length > 0
  }, placingOrder ? /*#__PURE__*/React.createElement(IconLoader, {
    size: 16
  }) : /*#__PURE__*/React.createElement(IconBadgeCheck, {
    size: 16
  }), placingOrder ? "Procesando..." : "Confirmar compra"))));
}
