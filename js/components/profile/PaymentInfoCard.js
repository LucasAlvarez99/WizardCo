/* src/components/profile/PaymentInfoCard.jsx
   Ya no se "vincula" una cuenta bancaria acá: el pago real se procesa en
   cada compra a través de Mercado Pago Checkout Pro (ver /server). Esta
   tarjeta es solo informativa. */

function PaymentInfoCard() {
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-card profile-card--ok"
  }, /*#__PURE__*/React.createElement(IconBuilding, {
    size: 20
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "profile-card__title"
  }, "Pagos con Mercado Pago"), /*#__PURE__*/React.createElement("p", {
    className: "profile-card__hint"
  }, "No guardamos ning\xFAn dato bancario en tu cuenta. Cada compra se paga de forma segura al momento, a trav\xE9s del checkout real de Mercado Pago (tarjetas, cuenta bancaria o dinero en cuenta) \u2014 ni WizardCo ni este perfil ven ni guardan tus datos de pago en ning\xFAn momento.")));
}
