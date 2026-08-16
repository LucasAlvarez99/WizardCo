/* src/components/profile/PaymentInfoCard.jsx
   Ya no se "vincula" una cuenta bancaria acá: el pago real se procesa en
   cada compra a través de Mercado Pago Checkout Pro (ver /server). Esta
   tarjeta es solo informativa. */

function PaymentInfoCard() {
  return (
    <div className="profile-card profile-card--ok">
      <IconBuilding size={20} />
      <div style={{ flex: 1 }}>
        <p className="profile-card__title">Pagos con Mercado Pago</p>
        <p className="profile-card__hint">
          No guardamos ningún dato bancario en tu cuenta. Cada compra se paga de forma
          segura al momento, a través del checkout real de Mercado Pago (tarjetas, cuenta
          bancaria o dinero en cuenta) — ni WizardCo ni este perfil ven ni guardan tus datos
          de pago en ningún momento.
        </p>
      </div>
    </div>
  );
}
