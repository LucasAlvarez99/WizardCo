/* src/components/profile/BankAccountCard.jsx
   Simulado: guarda solo un alias + últimos 4 dígitos, nunca el número
   completo. Para procesar pagos reales hace falta un backend conectado a
   un procesador habilitado (Mercado Pago, Stripe Connect, etc.), no un
   formulario del lado del cliente como este. */

function BankAccountCard() {
  const {
    user,
    linkBankAccount,
    unlinkBankAccount
  } = useAuth();
  const [form, setForm] = useState({
    holder: "",
    bankName: "",
    accountNumber: ""
  });
  const [message, setMessage] = useState(null);
  const handleSubmit = e => {
    e.preventDefault();
    const result = linkBankAccount(form.holder, form.bankName, form.accountNumber);
    setMessage(result);
    if (result.success) setForm({
      holder: "",
      bankName: "",
      accountNumber: ""
    });
  };
  if (user.bankAccount) {
    return /*#__PURE__*/React.createElement("div", {
      className: "profile-card profile-card--ok"
    }, /*#__PURE__*/React.createElement(IconBuilding, {
      size: 20
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      className: "profile-card__title"
    }, "Cuenta bancaria vinculada"), /*#__PURE__*/React.createElement("p", {
      className: "profile-card__hint"
    }, user.bankAccount.bankName, " \xB7 titular ", user.bankAccount.holder, " \xB7 terminada en ", user.bankAccount.last4)), /*#__PURE__*/React.createElement("button", {
      className: "admin-row-delete",
      onClick: unlinkBankAccount,
      "aria-label": "Desvincular cuenta"
    }, /*#__PURE__*/React.createElement(IconTrash, {
      size: 16
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-card__head"
  }, /*#__PURE__*/React.createElement(IconBuilding, {
    size: 20
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "profile-card__title"
  }, "Vincul\xE1 una cuenta bancaria"), /*#__PURE__*/React.createElement("p", {
    className: "profile-card__hint"
  }, "Necesario para validar tus compras. Datos simulados (demo): guardamos un alias y solo los \xFAltimos 4 d\xEDgitos, nunca el n\xFAmero completo."))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Titular de la cuenta",
    value: form.holder,
    onChange: e => setForm(f => ({
      ...f,
      holder: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Banco",
    value: form.bankName,
    onChange: e => setForm(f => ({
      ...f,
      bankName: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "CBU / N\xB0 de cuenta",
    value: form.accountNumber,
    onChange: e => setForm(f => ({
      ...f,
      accountNumber: e.target.value
    }))
  })), message && !message.success && /*#__PURE__*/React.createElement("p", {
    className: "form-error"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", message.message), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary"
  }, /*#__PURE__*/React.createElement(IconBuilding, {
    size: 16
  }), " Vincular cuenta")));
}
