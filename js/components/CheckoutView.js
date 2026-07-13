/* ============================================================================
   CheckoutView.jsx — usa CouponManager vía useCart(), valida cuenta
   verificada, y procesa el pago real de la compra con Mercado Pago
   Checkout Pro (redirige a la pasarela real; nunca vemos ni guardamos
   datos de tarjeta/cuenta bancaria acá). El resultado del pago vuelve por
   query params (ver App.jsx) y se resuelve con la prop `paymentReturn`.
============================================================================ */

function buildBackUrls() {
  const origin = window.location.origin + window.location.pathname;
  return {
    success: `${origin}?mp_status=success`,
    failure: `${origin}?mp_status=failure`,
    pending: `${origin}?mp_status=pending`
  };
}
function CheckoutView({
  onBack,
  onFinish,
  onGoProfile,
  onOpenLogin,
  paymentReturn,
  onClearPaymentReturn
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
  const [redirecting, setRedirecting] = useState(false);
  const [payError, setPayError] = useState(null);
  const [resolvedOrder, setResolvedOrder] = useState(null);

  // Al volver desde Mercado Pago, resolvemos el resultado una sola vez.
  useEffect(() => {
    if (!paymentReturn) return;
    const pendingRaw = localStorage.getItem("wizardco_pending_order");
    const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
    if (paymentReturn.status === "success" && pending) {
      const order = {
        ...pending,
        paymentStatus: "approved"
      };
      logOrder(order);
      setResolvedOrder(order);
      clearCart();
      localStorage.removeItem("wizardco_pending_order");
    } else if (paymentReturn.status === "pending" && pending) {
      const order = {
        ...pending,
        paymentStatus: "pending"
      };
      logOrder(order);
      setResolvedOrder(order);
      clearCart();
      localStorage.removeItem("wizardco_pending_order");
    }
    // en "failure" no tocamos el carrito: dejamos que la persona reintente.
    // eslint-disable-next-line
  }, [paymentReturn]);
  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setCouponMessage(result);
    if (result.success) setCouponInput("");
  };
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
  const handlePay = async () => {
    if (blockers.length > 0 || items.length === 0) return;
    setPayError(null);
    setRedirecting(true);
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
    const externalReference = `WZ-${Date.now()}`;
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map(i => ({
            title: i.name,
            quantity: i.qty,
            unit_price: i.price
          })),
          payer: {
            email: user.email,
            name: user.name
          },
          external_reference: externalReference,
          back_urls: buildBackUrls()
        })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "El backend de pagos no respondió correctamente.");
      }
      const data = await response.json();
      // Guardamos el pedido pendiente para poder registrarlo cuando la
      // persona vuelva desde Mercado Pago (ver el useEffect de arriba).
      localStorage.setItem("wizardco_pending_order", JSON.stringify({
        ...order,
        externalReference
      }));
      window.location.href = data.init_point || data.sandbox_init_point;
    } catch (err) {
      setRedirecting(false);
      setPayError(err.message + " — ¿Corriste el backend en /server con un MP_ACCESS_TOKEN real? Mirá /server/README.md.");
    }
  };

  /* ---------------- Pantallas de resultado (volviendo de Mercado Pago) ---------------- */
  if (paymentReturn && paymentReturn.status === "failure") {
    return /*#__PURE__*/React.createElement("div", {
      className: "order-success order-success--error"
    }, /*#__PURE__*/React.createElement("div", {
      className: "order-success__icon order-success__icon--error"
    }, /*#__PURE__*/React.createElement(IconAlert, {
      size: 32
    })), /*#__PURE__*/React.createElement("h2", null, "El pago no se pudo completar"), /*#__PURE__*/React.createElement("p", null, "Mercado Pago rechaz\xF3 o cancel\xF3 el pago. Tu carrito sigue intacto, pod\xE9s volver a intentar."), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        marginTop: 20,
        maxWidth: 240,
        marginLeft: "auto",
        marginRight: "auto"
      },
      onClick: onClearPaymentReturn
    }, "Volver a intentar"));
  }
  if (paymentReturn && (paymentReturn.status === "success" || paymentReturn.status === "pending") && resolvedOrder) {
    const isPending = resolvedOrder.paymentStatus === "pending";
    const message = `Nuevo pedido ${isPending ? "(pago pendiente) " : ""}\nCliente: ${resolvedOrder.customerName} (${resolvedOrder.customerEmail})\n\n${resolvedOrder.items.map(i => `• ${i.qty}x ${i.name}`).join("\n")}\n\nTotal: ${formatCurrency(resolvedOrder.total)}`;
    const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent("Nuevo pedido — WizardCo")}&body=${encodeURIComponent(message)}`;
    return /*#__PURE__*/React.createElement("div", {
      className: "order-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: `order-success__icon ${isPending ? "order-success__icon--pending" : ""}`
    }, isPending ? /*#__PURE__*/React.createElement(IconLoader, {
      size: 32
    }) : /*#__PURE__*/React.createElement(IconCheck, {
      size: 32
    })), /*#__PURE__*/React.createElement("h2", null, isPending ? "Pago en proceso" : "¡Compra confirmada!"), /*#__PURE__*/React.createElement("p", null, isPending ? "Mercado Pago está procesando tu pago (por ejemplo, un pago en efectivo o transferencia). Te vamos a avisar cuando se acredite." : `Gracias por elegir WizardCo, ${resolvedOrder.customerName.split(" ")[0]}.`), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, formatCurrency(totals.total)))), payError && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", payError), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: handlePay,
    disabled: redirecting || items.length === 0 || blockers.length > 0
  }, redirecting ? /*#__PURE__*/React.createElement(IconLoader, {
    size: 16
  }) : /*#__PURE__*/React.createElement(IconCard, {
    size: 16
  }), redirecting ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"))));
}
