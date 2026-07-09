/* src/components/admin/OrdersTab.jsx */

function buildOrderMessage(order) {
  const lines = order.items.map((i) => `• ${i.qty}x ${i.name} — ${formatCurrency(i.price * i.qty)}`).join("\n");
  return `Nuevo pedido ${order.id}\nCliente: ${order.customerName} (${order.customerEmail})\n\n${lines}\n\nTotal: ${formatCurrency(order.total)}${order.couponCode ? `\nCupón usado: ${order.couponCode}` : ""}`;
}

function OrdersTab() {
  const { orders, contact } = useAdminData();

  return (
    <div className="admin-tab admin-tab--single">
      <div className="admin-card admin-card--wide">
        <h3 className="admin-card__title"><IconClipboard size={16} /> Pedidos confirmados ({orders.length})</h3>

        {orders.length === 0 ? (
          <p className="admin-empty">Todavía no hay pedidos confirmados.</p>
        ) : (
          <ul className="admin-orders-list">
            {orders.map((order) => {
              const message = buildOrderMessage(order);
              const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
              const mailLink = `mailto:${contact.email}?subject=${encodeURIComponent(`Pedido ${order.id} — WizardCo`)}&body=${encodeURIComponent(message)}`;
              return (
                <li key={order.id} className="admin-order-item">
                  <div>
                    <p className="admin-order-item__id">{order.id}</p>
                    <p className="admin-order-item__meta">
                      {order.customerName} · {order.customerEmail} · {new Date(order.date).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="admin-order-item__total">{formatCurrency(order.total)}</div>
                  <div className="admin-order-item__actions">
                    <a className="admin-notify-btn admin-notify-btn--wa" href={waLink} target="_blank" rel="noreferrer">
                      <IconMessageCircle size={14} /> WhatsApp
                    </a>
                    <a className="admin-notify-btn admin-notify-btn--mail" href={mailLink}>
                      <IconMail size={14} /> Email
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
