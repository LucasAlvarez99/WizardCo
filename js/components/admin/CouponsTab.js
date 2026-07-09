/* src/components/admin/CouponsTab.jsx */

function CouponsTab() {
  const {
    coupons,
    addCoupon,
    deleteCoupon
  } = useAdminData();
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "10",
    usableCount: "10"
  });
  const [message, setMessage] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.code.trim()) {
      setMessage({
        success: false,
        text: "Ingresá un código."
      });
      return;
    }
    const result = addCoupon(form);
    setMessage({
      success: result.success,
      text: result.message
    });
    if (result.success) setForm({
      code: "",
      discountPercentage: "10",
      usableCount: "10"
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconTag, {
    size: 16
  }), " Nuevo cup\xF3n"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "C\xF3digo (ej: VERANO10)",
    value: form.code,
    onChange: e => setForm(f => ({
      ...f,
      code: e.target.value.toUpperCase()
    })),
    style: {
      textTransform: "uppercase"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    max: "90",
    placeholder: "% de descuento",
    value: form.discountPercentage,
    onChange: e => setForm(f => ({
      ...f,
      discountPercentage: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "number",
    min: "1",
    placeholder: "Usos disponibles",
    value: form.usableCount,
    onChange: e => setForm(f => ({
      ...f,
      usableCount: e.target.value
    }))
  })), message && /*#__PURE__*/React.createElement("p", {
    className: `form-error ${message.success ? "form-error--ok" : ""}`
  }, message.success ? /*#__PURE__*/React.createElement(IconCheck, {
    size: 13
  }) : /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", message.text), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement(IconTag, {
    size: 16
  }), " Crear cup\xF3n"))), /*#__PURE__*/React.createElement("div", {
    className: "admin-card admin-card--wide"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    size: 16
  }), " Cupones activos (", coupons.length, ")"), coupons.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "admin-empty"
  }, "No hay cupones activos. Los que llegan a 0 usos se eliminan solos.") : /*#__PURE__*/React.createElement("div", {
    className: "admin-table-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "admin-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Descuento"), /*#__PURE__*/React.createElement("th", null, "Usos restantes"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, coupons.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.code
  }, /*#__PURE__*/React.createElement("td", {
    className: "admin-table__main"
  }, c.code), /*#__PURE__*/React.createElement("td", null, c.discountPercentage, "%"), /*#__PURE__*/React.createElement("td", null, c.usableCount), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "admin-row-delete",
    onClick: () => deleteCoupon(c.code),
    "aria-label": "Eliminar cup\xF3n"
  }, /*#__PURE__*/React.createElement(IconTrash, {
    size: 15
  }))))))))));
}
