/* src/components/profile/VerifyEmailCard.jsx */

function VerifyEmailCard() {
  const { user, sendVerificationCode, verifyEmail } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSend = async () => {
    setSending(true);
    setMessage(null);
    const result = await sendVerificationCode();
    setSending(false);
    if (result.success) {
      setCodeSent(true);
    } else {
      setMessage(result);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    const result = await verifyEmail(codeInput);
    setVerifying(false);
    setMessage(result);
    if (result.success) setCodeSent(false);
  };

  if (user.verified) {
    return (
      <div className="profile-card profile-card--ok">
        <IconBadgeCheck size={20} />
        <div>
          <p className="profile-card__title">Cuenta verificada</p>
          <p className="profile-card__hint">Tu email {user.email} ya fue confirmado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card__head">
        <IconAlert size={20} />
        <div>
          <p className="profile-card__title">Verificá tu cuenta</p>
          <p className="profile-card__hint">
            Necesario para poder comprar. Te mandamos un código de 6 dígitos a {user.email}.
          </p>
        </div>
      </div>

      {!codeSent ? (
        <button className="btn-primary" onClick={handleSend} disabled={sending}>
          <IconMail size={16} /> {sending ? "Enviando..." : "Enviar código de verificación"}
        </button>
      ) : (
        <form onSubmit={handleVerify} className="admin-form">
          <p className="profile-demo-code">Revisá tu email — te mandamos un código a <strong>{user.email}</strong>.</p>
          <div className="admin-form__row">
            <input
              className="form-input"
              placeholder="Ingresá el código"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={verifying}>
              {verifying ? "Verificando..." : "Verificar"}
            </button>
          </div>
          <button type="button" className="profile-resend-link" onClick={handleSend} disabled={sending}>
            {sending ? "Reenviando..." : "Reenviar código"}
          </button>
        </form>
      )}

      {message && (
        <p className={`form-error ${message.success ? "form-error--ok" : ""}`}>
          {message.success ? <IconCheck size={13} /> : <IconAlert size={13} />} {message.message}
        </p>
      )}
    </div>
  );
}
