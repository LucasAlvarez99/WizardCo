/* ============================================================================
   LoginModal.jsx
============================================================================ */

function LoginModal({
  onClose
}) {
  const {
    login,
    register
  } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = mode === "login" ? login(form.email, form.password) : register(form.name, form.email, form.password);
      setLoading(false);
      if (!result.success) {
        setError(result.message);
      } else {
        onClose();
      }
    }, 500);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay__backdrop",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal__close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(IconX, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal__brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand__icon"
  }, /*#__PURE__*/React.createElement(IconWizardHat, {
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "brand__name",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand__wizard"
  }, "Wizard"), /*#__PURE__*/React.createElement("span", {
    className: "brand__accent"
  }, "Co"))), /*#__PURE__*/React.createElement("h2", {
    className: "modal__title"
  }, mode === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"), /*#__PURE__*/React.createElement("p", {
    className: "modal__subtitle"
  }, mode === "login" ? "Accedé a tus compras y diseños guardados." : "Sumate a la comunidad de WizardCo."), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "form-group"
  }, mode === "register" && /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nombre completo",
    value: form.name,
    onChange: e => setForm(f => ({
      ...f,
      name: e.target.value
    })),
    className: "form-input"
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "Email",
    value: form.email,
    onChange: e => setForm(f => ({
      ...f,
      email: e.target.value
    })),
    className: "form-input"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Contrase\xF1a (m\xEDn. 6 caracteres)",
    value: form.password,
    onChange: e => setForm(f => ({
      ...f,
      password: e.target.value
    })),
    className: "form-input"
  }), error && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "btn-primary"
  }, loading && /*#__PURE__*/React.createElement(IconLoader, {
    size: 16
  }), mode === "login" ? "Ingresar" : "Crear cuenta")), /*#__PURE__*/React.createElement("p", {
    className: "modal__switch"
  }, mode === "login" ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? ", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMode(mode === "login" ? "register" : "login");
      setError("");
    }
  }, mode === "login" ? "Registrate" : "Ingresá")), /*#__PURE__*/React.createElement("p", {
    className: "modal__demo-tip"
  }, "Tip demo: us\xE1 un email que contenga ", /*#__PURE__*/React.createElement("strong", null, "\"admin\""), " (ej. admin@wizardco.com) para entrar con acceso al panel de administraci\xF3n.")));
}
