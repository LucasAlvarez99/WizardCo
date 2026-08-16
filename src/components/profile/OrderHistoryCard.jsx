/* src/components/profile/OrderHistoryCard.jsx */

function OrderHistoryCard() {
  const { user } = useAuth();
  const { orders } = useAdminData();

  const myOrders = orders.filter((o) => o.customerEmail === user.email);

  return (
    <div className="profile-card profile-card--block">
      <p className="profile-card__title"><IconClipboard size={16} /> Mis pedidos ({myOrders.length})</p>
      {myOrders.length === 0 ? (
        <p className="admin-empty">Todavía no hiciste ninguna compra.</p>
      ) : (
        <ul className="admin-orders-list">
          {myOrders.map((order) => (
            <li key={order.id} className="admin-order-item">
              <div>
                <p className="admin-order-item__id">{order.id}</p>
                <p className="admin-order-item__meta">{new Date(order.date).toLocaleString("es-AR")} · {order.items.length} producto(s)</p>
              </div>
              <div className="admin-order-item__total">{formatCurrency(order.total)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
