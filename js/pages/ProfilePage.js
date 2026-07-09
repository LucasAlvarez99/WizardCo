/* ============================================================================
   ProfilePage.jsx
============================================================================ */

function ProfilePage({
  onBack
}) {
  const {
    user,
    logout
  } = useAuth();
  if (!user) {
    return /*#__PURE__*/React.createElement("div", {
      className: "admin-denied"
    }, /*#__PURE__*/React.createElement(IconUser, {
      size: 40,
      strokeWidth: 1.2
    }), /*#__PURE__*/React.createElement("h2", null, "No iniciaste sesi\xF3n"), /*#__PURE__*/React.createElement("p", null, "Ingres\xE1 a tu cuenta para ver tu perfil."), /*#__PURE__*/React.createElement("button", {
      className: "back-link",
      onClick: onBack
    }, /*#__PURE__*/React.createElement(IconChevronLeft, {
      size: 16
    }), " Volver al cat\xE1logo"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-page"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-link",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(IconChevronLeft, {
    size: 16
  }), " Volver al cat\xE1logo"), /*#__PURE__*/React.createElement("div", {
    className: "profile-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-avatar profile-avatar"
  }, user.name.charAt(0).toUpperCase()), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "checkout-title",
    style: {
      marginBottom: 2
    }
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "admin-subtitle"
  }, user.email, user.isAdmin ? " · Administrador" : "")), /*#__PURE__*/React.createElement("button", {
    className: "admin-row-delete profile-logout",
    onClick: logout,
    "aria-label": "Cerrar sesi\xF3n"
  }, /*#__PURE__*/React.createElement(IconLogout, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "profile-grid"
  }, /*#__PURE__*/React.createElement(VerifyEmailCard, null), /*#__PURE__*/React.createElement(BankAccountCard, null), /*#__PURE__*/React.createElement(OrderHistoryCard, null)));
}
