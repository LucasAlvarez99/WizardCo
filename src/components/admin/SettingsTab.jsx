/* src/components/admin/SettingsTab.jsx */

function SettingsTab() {
  const { contact, updateContact } = useAdminData();
  const [form, setForm] = useState(contact);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContact(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-tab admin-tab--single">
      <div className="admin-card">
        <h3 className="admin-card__title"><IconCog size={16} /> Aviso de venta</h3>
        <p className="admin-card__hint">
          Cuando se confirma una compra, se arma un mensaje con el detalle del pedido para enviarlo
          por WhatsApp o Email a esta cuenta (con un clic, usando tu app de WhatsApp/Mail ya instalada).
        </p>
        <form onSubmit={handleSubmit} className="admin-form">
          <label className="admin-form__label"><IconMessageCircle size={14} /> WhatsApp (con código de país)</label>
          <input
            className="form-input"
            placeholder="+5491100000000"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          />

          <label className="admin-form__label"><IconMail size={14} /> Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="ventas@wizardco.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />

          <button type="submit" className="btn-primary">
            {saved ? <React.Fragment><IconCheck size={16} /> Guardado</React.Fragment> : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
