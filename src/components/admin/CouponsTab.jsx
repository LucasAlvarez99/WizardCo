/* src/components/admin/CouponsTab.jsx */

function CouponsTab() {
  const { coupons, couponsLoading, couponsError, addCoupon, deleteCoupon } = useAdminData();
  const [form, setForm] = useState({ code: "", discountPercentage: "10", usableCount: "10" });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      setMessage({ success: false, text: "Ingresá un código." });
      return;
    }
    setSubmitting(true);
    const result = await addCoupon(form);
    setSubmitting(false);
    setMessage({ success: result.success, text: result.message });
    if (result.success) setForm({ code: "", discountPercentage: "10", usableCount: "10" });
  };

  return (
    <div className="admin-tab">
      <div className="admin-card">
        <h3 className="admin-card__title"><IconTag size={16} /> Nuevo cupón</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            className="form-input"
            placeholder="Código (ej: VERANO10)"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            style={{ textTransform: "uppercase" }}
          />
          <div className="admin-form__row">
            <input
              className="form-input"
              type="number"
              min="1"
              max="90"
              placeholder="% de descuento"
              value={form.discountPercentage}
              onChange={(e) => setForm((f) => ({ ...f, discountPercentage: e.target.value }))}
            />
            <input
              className="form-input"
              type="number"
              min="1"
              placeholder="Usos disponibles"
              value={form.usableCount}
              onChange={(e) => setForm((f) => ({ ...f, usableCount: e.target.value }))}
            />
          </div>

          {message && (
            <p className={`form-error ${message.success ? "form-error--ok" : ""}`}>
              {message.success ? <IconCheck size={13} /> : <IconAlert size={13} />} {message.text}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            <IconTag size={16} /> {submitting ? "Creando..." : "Crear cupón"}
          </button>
        </form>
      </div>

      <div className="admin-card admin-card--wide">
        <h3 className="admin-card__title"><IconClipboard size={16} /> Cupones activos ({coupons.length})</h3>
        {couponsError && <p className="form-error"><IconAlert size={13} /> {couponsError}</p>}
        {couponsLoading ? (
          <p className="admin-empty">Cargando cupones...</p>
        ) : coupons.length === 0 ? (
          <p className="admin-empty">No hay cupones activos. Los que llegan a 0 usos se eliminan solos.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descuento</th>
                  <th>Usos restantes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.code}>
                    <td className="admin-table__main">{c.code}</td>
                    <td>{c.discountPercentage}%</td>
                    <td>{c.usableCount}</td>
                    <td>
                      <button className="admin-row-delete" onClick={() => deleteCoupon(c.code)} aria-label="Eliminar cupón">
                        <IconTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
