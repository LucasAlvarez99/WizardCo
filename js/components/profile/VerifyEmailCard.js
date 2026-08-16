/* src/components/profile/VerifyEmailCard.jsx */

function VerifyEmailCard() {
  const {
    user,
    sendVerificationCode,
    verifyEmail
  } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSend = async () => {
    setSending(true);
    setMessage(null);
    const result = await sendVerificationCode();
    setSending(false);
    if (result.success) {
      setCodeSent(true);
    } else {
      setMessage(result);
    }
  };
  const handleVerify = async e => {
    e.preventDefault();
    setVerifying(true);
    const result = await verifyEmail(codeInput);
    setVerifying(false);
    setMessage(result);
    if (result.success) setCodeSent(false);
  };
  if (user.verified) {
    return /*#__PURE__*/React.createElement("div", {
      className: "profile-card profile-card--ok"
    }, /*#__PURE__*/React.createElement(IconBadgeCheck, {
      size: 20
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "profile-card__title"
    }, "Cuenta verificada"), /*#__PURE__*/React.createElement("p", {
      className: "profile-card__hint"
    }, "Tu email ", user.email, " ya fue confirmado.")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "profile-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-card__head"
  }, /*#__PURE__*/React.createElement(IconAlert, {
    size: 20
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "profile-card__title"
  }, "Verific\xE1 tu cuenta"), /*#__PURE__*/React.createElement("p", {
    className: "profile-card__hint"
  }, "Necesario para poder comprar. Te mandamos un c\xF3digo de 6 d\xEDgitos a ", user.email, "."))), !codeSent ? /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: handleSend,
    disabled: sending
  }, /*#__PURE__*/React.createElement(IconMail, {
    size: 16
  }), " ", sending ? "Enviando..." : "Enviar código de verificación") : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleVerify,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("p", {
    className: "profile-demo-code"
  }, "Revis\xE1 tu email \u2014 te mandamos un c\xF3digo a ", /*#__PURE__*/React.createElement("strong", null, user.email), "."), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Ingres\xE1 el c\xF3digo",
    value: codeInput,
    onChange: e => setCodeInput(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary",
    disabled: verifying
  }, verifying ? "Verificando..." : "Verificar")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "profile-resend-link",
    onClick: handleSend,
    disabled: sending
  }, sending ? "Reenviando..." : "Reenviar código")), message && /*#__PURE__*/React.createElement("p", {
    className: `form-error ${message.success ? "form-error--ok" : ""}`
  }, message.success ? /*#__PURE__*/React.createElement(IconCheck, {
    size: 13
  }) : /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", message.message));
}
