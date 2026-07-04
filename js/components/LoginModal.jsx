/* ============================================================================
   LoginModal.jsx
============================================================================ */

function LoginModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result =
        mode === "login" ? login(form.email, form.password) : register(form.name, form.email, form.password);
      setLoading(false);
      if (!result.success) {
        setError(result.message);
      } else {
        onClose();
      }
    }, 500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-overlay__backdrop" onClick={onClose} />
      <div className="modal">
        <button className="modal__close" onClick={onClose}><IconX size={20} /></button>

        <div className="modal__brand">
          <div className="brand__icon"><IconLayers size={18} /></div>
          <span className="brand__name" style={{ display: "block" }}>
            Voxel<span className="brand__accent">Market</span>
          </span>
        </div>

        <h2 className="modal__title">{mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}</h2>
        <p className="modal__subtitle">
          {mode === "login" ? "Accedé a tus compras y diseños guardados." : "Sumate a la comunidad de VoxelMarket."}
        </p>

        <form onSubmit={submit} className="form-group">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="form-input"
          />

          {error && (
            <p className="form-error"><IconAlert size={13} /> {error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <IconLoader size={16} />}
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
          </button>
        </form>

        <p className="modal__switch">
          {mode === "login" ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Registrate" : "Ingresá"}
          </button>
        </p>
      </div>
    </div>
  );
}
