/* ============================================================================
   CartDrawer.jsx
============================================================================ */

function CartDrawer({ onClose, onCheckout }) {
  const { items, removeFromCart, updateQty, totals } = useCart();

  return (
    <div className="cart-overlay">
      <div className="cart-overlay__backdrop" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2><IconCart size={18} /> Tu carrito</h2>
          <button onClick={onClose}><IconX size={20} /></button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <IconPackage size={40} strokeWidth={1.2} />
              <p>Todavía no agregaste productos.</p>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__thumb"><IconPrinter size={22} /></div>
                  <div className="cart-item__info">
                    <p className="cart-item__name line-clamp-2">{item.name}</p>
                    <p className="cart-item__material">{item.material}</p>
                    <div className="cart-item__row">
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><IconMinus size={14} /></button>
                        <span className="qty-value">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><IconPlus size={14} /></button>
                      </div>
                      <span className="cart-item__price">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Eliminar">
                    <IconTrash size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <button className="btn-primary" onClick={onCheckout}>
              <IconCard size={16} /> Ir a pagar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
