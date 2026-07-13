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
    pending: `${origin}?mp_status=pending`,
  };
}

function CheckoutView({ onBack, onFinish, onGoProfile, onOpenLogin, paymentReturn, onClearPaymentReturn }) {
  const { user } = useAuth();
  const { items, totals, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { logOrder, contact } = useAdminData();
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
      const order = { ...pending, paymentStatus: "approved" };
      logOrder(order);
      setResolvedOrder(order);
      clearCart();
      localStorage.removeItem("wizardco_pending_order");
    } else if (paymentReturn.status === "pending" && pending) {
      const order = { ...pending, paymentStatus: "pending" };
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
  if (!user) blockers.push({ text: "Tenés que iniciar sesión para comprar.", action: onOpenLogin, actionLabel: "Ingresar" });
  if (user && !user.verified) blockers.push({ text: "Tu cuenta todavía no está verificada.", action: onGoProfile, actionLabel: "Verificar cuenta" });

  const handlePay = async () => {
    if (blockers.length > 0 || items.length === 0) return;
    setPayError(null);
    setRedirecting(true);

    const order = {
      customerName: user.name,
      customerEmail: user.email,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      tax: totals.tax,
      total: totals.total,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    };
    const externalReference = `WZ-${Date.now()}`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/create-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ title: i.name, quantity: i.qty, unit_price: i.price })),
          payer: { email: user.email, name: user.name },
          external_reference: externalReference,
          back_urls: buildBackUrls(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "El backend de pagos no respondió correctamente.");
      }

      const data = await response.json();
      // Guardamos el pedido pendiente para poder registrarlo cuando la
      // persona vuelva desde Mercado Pago (ver el useEffect de arriba).
      localStorage.setItem("wizardco_pending_order", JSON.stringify({ ...order, externalReference }));
      window.location.href = data.init_point || data.sandbox_init_point;
    } catch (err) {
      setRedirecting(false);
      setPayError(
        err.message +
          " — ¿Corriste el backend en /server con un MP_ACCESS_TOKEN real? Mirá /server/README.md."
      );
    }
  };

  /* ---------------- Pantallas de resultado (volviendo de Mercado Pago) ---------------- */
  if (paymentReturn && paymentReturn.status === "failure") {
    return (
      <div className="order-success order-success--error">
        <div className="order-success__icon order-success__icon--error"><IconAlert size={32} /></div>
        <h2>El pago no se pudo completar</h2>
        <p>Mercado Pago rechazó o canceló el pago. Tu carrito sigue intacto, podés volver a intentar.</p>
        <button className="btn-primary" style={{ marginTop: 20, maxWidth: 240, marginLeft: "auto", marginRight: "auto" }} onClick={onClearPaymentReturn}>
          Volver a intentar
        </button>
      </div>
    );
  }

  if (paymentReturn && (paymentReturn.status === "success" || paymentReturn.status === "pending") && resolvedOrder) {
    const isPending = resolvedOrder.paymentStatus === "pending";
    const message = `Nuevo pedido ${isPending ? "(pago pendiente) " : ""}\nCliente: ${resolvedOrder.customerName} (${resolvedOrder.customerEmail})\n\n${resolvedOrder.items
      .map((i) => `• ${i.qty}x ${i.name}`)
      .join("\n")}\n\nTotal: ${formatCurrency(resolvedOrder.total)}`;
    const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent("Nuevo pedido — WizardCo")}&body=${encodeURIComponent(message)}`;

    return (
      <div className="order-success">
        <div className={`order-success__icon ${isPending ? "order-success__icon--pending" : ""}`}>
          {isPending ? <IconLoader size={32} /> : <IconCheck size={32} />}
        </div>
        <h2>{isPending ? "Pago en proceso" : "¡Compra confirmada!"}</h2>
        <p>
          {isPending
            ? "Mercado Pago está procesando tu pago (por ejemplo, un pago en efectivo o transferencia). Te vamos a avisar cuando se acredite."
            : `Gracias por elegir WizardCo, ${resolvedOrder.customerName.split(" ")[0]}.`}
        </p>

        <div className="order-success__notify">
          <p className="order-success__notify-label">Avisar la venta al equipo de WizardCo:</p>
          <div className="order-success__notify-actions">
            <a className="admin-notify-btn admin-notify-btn--wa" href={waLink} target="_blank" rel="noreferrer">
              <IconMessageCircle size={15} /> Enviar por WhatsApp
            </a>
            <a className="admin-notify-btn admin-notify-btn--mail" href={mailLink}>
              <IconMail size={15} /> Enviar por Email
            </a>
          </div>
        </div>

        <button className="back-link" style={{ marginTop: 24 }} onClick={onFinish}>
          <IconChevronLeft size={16} /> Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-link" onClick={onBack}>
        <IconChevronLeft size={16} /> Volver al catálogo
      </button>

      <h1 className="checkout-title">Finalizar compra</h1>

      {blockers.length > 0 && (
        <div className="checkout-blockers">
          {blockers.map((b, i) => (
            <div key={i} className="checkout-blocker">
              <IconAlert size={16} />
              <span>{b.text}</span>
              {b.action && (
                <button className="checkout-blocker__action" onClick={b.action}>{b.actionLabel}</button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="checkout-grid">
        <div>
          <h2 className="order-summary-title">Resumen del pedido</h2>
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <div>
                <p className="order-item__name">{item.name}</p>
                <p className="order-item__meta">Cantidad: {item.qty} · {item.material}</p>
              </div>
              <span className="order-item__price">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="checkout-summary-card">
          <div>
            <p className="coupon-label"><IconTag size={13} /> Cupón de descuento</p>
            {appliedCoupon ? (
              <div className="coupon-applied">
                <span>{appliedCoupon.code} · -{appliedCoupon.discountPercentage}%</span>
                <button onClick={removeCoupon}><IconX size={15} /></button>
              </div>
            ) : (
              <div className="coupon-input-row">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Ej: DESCUENTO3D"
                />
                <button onClick={handleApplyCoupon}>Aplicar</button>
              </div>
            )}
            {couponMessage && (
              <p className={`coupon-message ${couponMessage.success ? "coupon-message--success" : "coupon-message--error"}`}>
                {couponMessage.success ? <IconCheck size={13} /> : <IconAlert size={13} />}
                {couponMessage.message}
              </p>
            )}
          </div>

          <div className="totals-block">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="totals-row totals-row--discount">
                <span>Descuento</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
            <div className="totals-row">
              <span>IVA (21%)</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className="totals-row totals-row--final">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>

          {payError && (
            <p className="form-error"><IconAlert size={13} /> {payError}</p>
          )}

          <button className="btn-primary" onClick={handlePay} disabled={redirecting || items.length === 0 || blockers.length > 0}>
            {redirecting ? <IconLoader size={16} /> : <IconCard size={16} />}
            {redirecting ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
          </button>
        </div>
      </div>
    </div>
  );
}
