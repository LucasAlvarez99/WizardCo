/* ============================================================================
   CheckoutView.jsx — usa CouponManager vía useCart(), valida cuenta
   verificada + cuenta bancaria vinculada, registra el pedido en
   AdminDataContext y ofrece avisar la venta por WhatsApp/Email.
============================================================================ */

function CheckoutView({ onBack, onFinish, onGoProfile, onOpenLogin }) {
  const { user } = useAuth();
  const { items, totals, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { logOrder, contact } = useAdminData();
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
  if (!user) blockers.push({ text: "Tenés que iniciar sesión para comprar.", action: onOpenLogin, actionLabel: "Ingresar" });
  if (user && !user.verified) blockers.push({ text: "Tu cuenta todavía no está verificada.", action: onGoProfile, actionLabel: "Verificar cuenta" });
  if (user && !user.bankAccount) blockers.push({ text: "Necesitás vincular una cuenta bancaria para validar la compra.", action: onGoProfile, actionLabel: "Vincular cuenta" });

  const handleConfirm = () => {
    if (blockers.length > 0 || items.length === 0) return;
    setPlacingOrder(true);
    setTimeout(() => {
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
      logOrder(order);
      setLastOrder(order);
      setPlacingOrder(false);
      setOrderDone(true);
      clearCart();
    }, 900);
  };

  if (orderDone) {
    const message = `Nuevo pedido confirmado\nCliente: ${lastOrder.customerName} (${lastOrder.customerEmail})\n\n${lastOrder.items
      .map((i) => `• ${i.qty}x ${i.name}`)
      .join("\n")}\n\nTotal: ${formatCurrency(lastOrder.total)}`;
    const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent("Nuevo pedido — WizardCo")}&body=${encodeURIComponent(message)}`;

    return (
      <div className="order-success">
        <div className="order-success__icon"><IconCheck size={32} /></div>
        <h2>¡Compra confirmada!</h2>
        <p>Gracias por elegir WizardCo, {lastOrder.customerName.split(" ")[0]}.</p>

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

          <button className="btn-primary" onClick={handleConfirm} disabled={placingOrder || items.length === 0 || blockers.length > 0}>
            {placingOrder ? <IconLoader size={16} /> : <IconBadgeCheck size={16} />}
            {placingOrder ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
