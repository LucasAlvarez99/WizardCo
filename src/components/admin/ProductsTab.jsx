/* src/components/admin/ProductsTab.jsx */

const EMPTY_PRODUCT = {
  name: "",
  category: CATEGORIES[0].id,
  price: "",
  discount: "0",
  material: MATERIALS[0],
  fileType: "fisico",
  freeShipping: false,
  rating: "5",
  sales: "0",
  seller: "Vendedor Confiable",
  gradient: "grad-blue",
};

function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState("");

  const handleField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError("Completá al menos el nombre y el precio.");
      return;
    }
    addProduct({
      ...form,
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      rating: Number(form.rating) || 5,
      sales: Number(form.sales) || 0,
    });
    setForm(EMPTY_PRODUCT);
    setError("");
  };

  return (
    <div className="admin-tab">
      <div className="admin-card">
        <h3 className="admin-card__title"><IconPackage size={16} /> Nuevo producto</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <input className="form-input" placeholder="Nombre del producto" value={form.name} onChange={(e) => handleField("name", e.target.value)} />

          <div className="admin-form__row">
            <select className="form-input" value={form.category} onChange={(e) => handleField("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <select className="form-input" value={form.material} onChange={(e) => handleField("material", e.target.value)}>
              {MATERIALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="admin-form__row">
            <input className="form-input" type="number" min="0" placeholder="Precio (ARS)" value={form.price} onChange={(e) => handleField("price", e.target.value)} />
            <input className="form-input" type="number" min="0" max="90" placeholder="Descuento %" value={form.discount} onChange={(e) => handleField("discount", e.target.value)} />
          </div>

          <div className="admin-form__row">
            <select className="form-input" value={form.fileType} onChange={(e) => handleField("fileType", e.target.value)}>
              {FILE_TYPES.map((ft) => (
                <option key={ft.id} value={ft.id}>{ft.label}</option>
              ))}
            </select>
            <label className="filter-checkbox admin-form__checkbox">
              <input type="checkbox" checked={form.freeShipping} onChange={(e) => handleField("freeShipping", e.target.checked)} />
              <span>Envío gratis</span>
            </label>
          </div>

          {error && <p className="form-error"><IconAlert size={13} /> {error}</p>}

          <button type="submit" className="btn-primary">
            <IconEdit size={16} /> Agregar producto
          </button>
        </form>
      </div>

      <div className="admin-card admin-card--wide">
        <h3 className="admin-card__title"><IconClipboard size={16} /> Catálogo actual ({products.length})</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Desc.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="admin-table__main">{p.name}</td>
                  <td>{CATEGORIES.find((c) => c.id === p.category)?.label || p.category}</td>
                  <td>
                    <input
                      type="number"
                      className="admin-inline-input"
                      value={p.price}
                      onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="admin-inline-input admin-inline-input--sm"
                      value={p.discount}
                      onChange={(e) => updateProduct(p.id, { discount: Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <button className="admin-row-delete" onClick={() => deleteProduct(p.id)} aria-label="Eliminar producto">
                      <IconTrash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
