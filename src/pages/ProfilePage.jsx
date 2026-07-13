/* ============================================================================
   ProfilePage.jsx
============================================================================ */

function ProfilePage({ onBack }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="admin-denied">
        <IconUser size={40} strokeWidth={1.2} />
        <h2>No iniciaste sesión</h2>
        <p>Ingresá a tu cuenta para ver tu perfil.</p>
        <button className="back-link" onClick={onBack}><IconChevronLeft size={16} /> Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <button className="back-link" onClick={onBack}>
        <IconChevronLeft size={16} /> Volver al catálogo
      </button>

      <div className="profile-header">
        <div className="user-avatar profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h1 className="checkout-title" style={{ marginBottom: 2 }}>{user.name}</h1>
          <p className="admin-subtitle">{user.email}{user.isAdmin ? " · Administrador" : ""}</p>
        </div>
        <button className="admin-row-delete profile-logout" onClick={logout} aria-label="Cerrar sesión">
          <IconLogout size={16} />
        </button>
      </div>

      <div className="profile-grid">
        <VerifyEmailCard />
        <PaymentInfoCard />
        <OrderHistoryCard />
      </div>
    </div>
  );
}
