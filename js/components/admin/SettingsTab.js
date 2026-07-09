/* src/components/admin/SettingsTab.jsx */

function SettingsTab() {
  const {
    contact,
    updateContact
  } = useAdminData();
  const [form, setForm] = useState(contact);
  const [saved, setSaved] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    updateContact(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "admin-tab admin-tab--single"
  }, /*#__PURE__*/React.createElement("div", {
    className: "admin-card"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "admin-card__title"
  }, /*#__PURE__*/React.createElement(IconCog, {
    size: 16
  }), " Aviso de venta"), /*#__PURE__*/React.createElement("p", {
    className: "admin-card__hint"
  }, "Cuando se confirma una compra, se arma un mensaje con el detalle del pedido para enviarlo por WhatsApp o Email a esta cuenta (con un clic, usando tu app de WhatsApp/Mail ya instalada)."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("label", {
    className: "admin-form__label"
  }, /*#__PURE__*/React.createElement(IconMessageCircle, {
    size: 14
  }), " WhatsApp (con c\xF3digo de pa\xEDs)"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "+5491100000000",
    value: form.whatsapp,
    onChange: e => setForm(f => ({
      ...f,
      whatsapp: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("label", {
    className: "admin-form__label"
  }, /*#__PURE__*/React.createElement(IconMail, {
    size: 14
  }), " Email"), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    type: "email",
    placeholder: "ventas@wizardco.com",
    value: form.email,
    onChange: e => setForm(f => ({
      ...f,
      email: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary"
  }, saved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconCheck, {
    size: 16
  }), " Guardado") : "Guardar cambios"))));
}
