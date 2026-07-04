/* ============================================================================
   CheckoutView.jsx — usa CouponManager vía useCart()
============================================================================ */

function CheckoutView({ onBack, onFinish }) {
  const { items, totals, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
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
    return (
      <div className="order-success">
        <div className="order-success__icon"><IconCheck size={32} /></div>
        <h2>¡Compra confirmada!</h2>
        <p>Te enviamos el comprobante por email. Gracias por elegir VoxelMarket.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-link" onClick={onBack}>
        <IconChevronLeft size={16} /> Volver al catálogo
      </button>

      <h1 className="checkout-title">Finalizar compra</h1>

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

          <button className="btn-primary" onClick={handleConfirm} disabled={placingOrder || items.length === 0}>
            {placingOrder ? <IconLoader size={16} /> : <IconBadgeCheck size={16} />}
            {placingOrder ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
