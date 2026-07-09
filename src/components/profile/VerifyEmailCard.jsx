/* src/components/profile/VerifyEmailCard.jsx */

function VerifyEmailCard() {
  const { user, sendVerificationCode, verifyEmail } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSend = () => {
    const code = sendVerificationCode();
    setSentCode(code);
    setMessage(null);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const result = verifyEmail(codeInput);
    setMessage(result);
    if (result.success) setSentCode(null);
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
            Necesario para poder comprar. Como esta demo no tiene backend de email, el código se
            muestra directamente acá (en un caso real llegaría por email).
          </p>
        </div>
      </div>

      {!sentCode ? (
        <button className="btn-primary" onClick={handleSend}>
          <IconMail size={16} /> Enviar código de verificación
        </button>
      ) : (
        <form onSubmit={handleVerify} className="admin-form">
          <p className="profile-demo-code">Tu código (demo): <strong>{sentCode}</strong></p>
          <div className="admin-form__row">
            <input
              className="form-input"
              placeholder="Ingresá el código"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <button type="submit" className="btn-primary">Verificar</button>
          </div>
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
