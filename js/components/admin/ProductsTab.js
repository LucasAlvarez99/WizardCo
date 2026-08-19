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
  images: [],
  video: null
};
function ProductsTab() {
  const {
    products,
    productsLoading,
    productsError,
    addProduct,
    updateProduct,
    deleteProduct
  } = useAdminData();
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingMediaProduct, setEditingMediaProduct] = useState(null);
  const handleField = (field, value) => setForm(f => ({
    ...f,
    [field]: value
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError("Completá al menos el nombre y el precio.");
      return;
    }
    setSubmitting(true);
    const result = await addProduct({
      ...form,
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      rating: Number(form.rating) || 5,
      sales: Number(form.sales) || 0
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setForm(EMPTY_PRODUCT);
    setError("");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconPackage, {
    size: 16
  }), " Nuevo producto"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Nombre del producto",
    value: form.name,
    onChange: e => handleField("name", e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.category,
    onChange: e => handleField("category", e.target.value)
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.id,
    value: c.id
  }, c.label))), /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.material,
    onChange: e => handleField("material", e.target.value)
  }, MATERIALS.map(m => /*#__PURE__*/React.createElement("option", {
    key: m,
    value: m
  }, m)))), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    placeholder: "Precio (ARS)",
    value: form.price,
    onChange: e => handleField("price", e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "0",
    max: "90",
    placeholder: "Descuento %",
    value: form.discount,
    onChange: e => handleField("discount", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("select", {
    className: "form-input",
    value: form.fileType,
    onChange: e => handleField("fileType", e.target.value)
  }, FILE_TYPES.map(ft => /*#__PURE__*/React.createElement("option", {
    key: ft.id,
    value: ft.id
  }, ft.label))), /*#__PURE__*/React.createElement("label", {
    className: "filter-checkbox admin-form__checkbox"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: form.freeShipping,
    onChange: e => handleField("freeShipping", e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Env\xEDo gratis"))), /*#__PURE__*/React.createElement(MediaUploader, {
    label: "Fotos (hasta 3)",
    resourceType: "image",
    max: 3,
    value: form.images,
    onChange: images => handleField("images", images)
  }), /*#__PURE__*/React.createElement(MediaUploader, {
    label: "Video (opcional)",
    resourceType: "video",
    max: 1,
    value: form.video ? [form.video] : [],
    onChange: videos => handleField("video", videos[0] || null)
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary",
    disabled: submitting
  }, /*#__PURE__*/React.createElement(IconEdit, {
    size: 16
  }), " ", submitting ? "Agregando..." : "Agregar producto"))), /*#__PURE__*/React.createElement("div", {
    className: "admin-card admin-card--wide"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    size: 16
  }), " Cat\xE1logo actual (", products.length, ")"), productsError && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", productsError), productsLoading ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "Cargando productos...") : products.length === 0 && !productsError ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "No hay productos cargados todav\xEDa.") : /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Producto"), /*#__PURE__*/React.createElement("th", null, "Fotos"), /*#__PURE__*/React.createElement("th", null, "Categor\xEDa"), /*#__PURE__*/React.createElement("th", null, "Precio"), /*#__PURE__*/React.createElement("th", null, "Desc."), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, products.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "admin-table__main"
  }, p.name), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "admin-media-cell",
    onClick: () => setEditingMediaProduct(p),
    "aria-label": "Editar fotos y video"
  }, p.images && p.images[0] ? /*#__PURE__*/React.createElement("img", {
    src: p.images[0],
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "admin-media-cell__empty"
  }, /*#__PURE__*/React.createElement(IconUpload, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "admin-media-cell__count"
  }, (p.images || []).length, "/3", p.video ? " · 🎬" : ""))), /*#__PURE__*/React.createElement("td", null, CATEGORIES.find(c => c.id === p.category)?.label || p.category), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "admin-inline-input",
    value: p.price,
    onChange: e => updateProduct(p.id, {
      price: Number(e.target.value)
    })
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "admin-inline-input admin-inline-input--sm",
    value: p.discount,
    onChange: e => updateProduct(p.id, {
      discount: Number(e.target.value)
    })
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "admin-row-delete",
    onClick: () => deleteProduct(p.id),
    "aria-label": "Eliminar producto"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    size: 15
  }))))))))), editingMediaProduct && /*#__PURE__*/React.createElement(ProductMediaModal, {
    product: editingMediaProduct,
    onUpdate: updateProduct,
    onClose: () => setEditingMediaProduct(null)
  }));
}
function ProductMediaModal({
  product,
  onUpdate,
  onClose
}) {
  const [images, setImages] = useState(product.images || []);
  const [video, setVideo] = useState(product.video || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const persist = async patch => {
    setSaving(true);
    setError("");
    const result = await onUpdate(product.id, patch);
    setSaving(false);
    if (!result.success) setError(result.message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay__backdrop",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "modal modal--wide"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal__close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconX, {
    size: 20
  })), /*#__PURE__*/React.createElement("p", {
    className: "modal__title"
  }, "Fotos y video"), /*#__PURE__*/React.createElement("p", {
    className: "modal__subtitle"
  }, product.name), /*#__PURE__*/React.createElement(MediaUploader, {
    label: "Fotos (hasta 3)",
    resourceType: "image",
    max: 3,
    value: images,
    onChange: next => {
      setImages(next);
      persist({
        images: next
      });
    }
  }), /*#__PURE__*/React.createElement(MediaUploader, {
    label: "Video (opcional)",
    resourceType: "video",
    max: 1,
    value: video ? [video] : [],
    onChange: next => {
      const v = next[0] || null;
      setVideo(v);
      persist({
        video: v
      });
    }
  }), saving && /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "Guardando..."), error && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", error)));
}
