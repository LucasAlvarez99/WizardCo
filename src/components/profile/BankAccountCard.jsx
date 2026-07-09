/* src/components/profile/BankAccountCard.jsx
   Simulado: guarda solo un alias + últimos 4 dígitos, nunca el número
   completo. Para procesar pagos reales hace falta un backend conectado a
   un procesador habilitado (Mercado Pago, Stripe Connect, etc.), no un
   formulario del lado del cliente como este. */

function BankAccountCard() {
  const { user, linkBankAccount, unlinkBankAccount } = useAuth();
  const [form, setForm] = useState({ holder: "", bankName: "", accountNumber: "" });
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = linkBankAccount(form.holder, form.bankName, form.accountNumber);
    setMessage(result);
    if (result.success) setForm({ holder: "", bankName: "", accountNumber: "" });
  };

  if (user.bankAccount) {
    return (
      <div className="profile-card profile-card--ok">
        <IconBuilding size={20} />
        <div style={{ flex: 1 }}>
          <p className="profile-card__title">Cuenta bancaria vinculada</p>
          <p className="profile-card__hint">
            {user.bankAccount.bankName} · titular {user.bankAccount.holder} · terminada en {user.bankAccount.last4}
          </p>
        </div>
        <button className="admin-row-delete" onClick={unlinkBankAccount} aria-label="Desvincular cuenta">
          <IconTrash size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <IconBuilding size={20} />
        <div>
          <p className="profile-card__title">Vinculá una cuenta bancaria</p>
          <p className="profile-card__hint">
            Necesario para validar tus compras. Datos simulados (demo): guardamos un alias y solo
            los últimos 4 dígitos, nunca el número completo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          className="form-input"
          placeholder="Titular de la cuenta"
          value={form.holder}
          onChange={(e) => setForm((f) => ({ ...f, holder: e.target.value }))}
        />
        <div className="admin-form__row">
          <input
            className="form-input"
            placeholder="Banco"
            value={form.bankName}
            onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
          />
          <input
            className="form-input"
            placeholder="CBU / N° de cuenta"
            value={form.accountNumber}
            onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
          />
        </div>

        {message && !message.success && (
          <p className="form-error"><IconAlert size={13} /> {message.message}</p>
        )}

        <button type="submit" className="btn-primary"><IconBuilding size={16} /> Vincular cuenta</button>
      </form>
    </div>
  );
}
