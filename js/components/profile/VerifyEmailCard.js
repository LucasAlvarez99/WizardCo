/* src/components/profile/VerifyEmailCard.jsx */

function VerifyEmailCard() {
  const {
    user,
    sendVerificationCode,
    verifyEmail
  } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [message, setMessage] = useState(null);
  const handleSend = () => {
    const code = sendVerificationCode();
    setSentCode(code);
    setMessage(null);
  };
  const handleVerify = e => {
    e.preventDefault();
    const result = verifyEmail(codeInput);
    setMessage(result);
    if (result.success) setSentCode(null);
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
  }, "Necesario para poder comprar. Como esta demo no tiene backend de email, el c\xF3digo se muestra directamente ac\xE1 (en un caso real llegar\xEDa por email)."))), !sentCode ? /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: handleSend
  }, /*#__PURE__*/React.createElement(IconMail, {
    size: 16
  }), " Enviar c\xF3digo de verificaci\xF3n") : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleVerify,
    className: "admin-form"
  }, /*#__PURE__*/React.createElement("p", {
    className: "profile-demo-code"
  }, "Tu c\xF3digo (demo): ", /*#__PURE__*/React.createElement("strong", null, sentCode)), /*#__PURE__*/React.createElement("div", {
    className: "admin-form__row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-input",
    placeholder: "Ingres\xE1 el c\xF3digo",
    value: codeInput,
    onChange: e => setCodeInput(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-primary"
  }, "Verificar"))), message && /*#__PURE__*/React.createElement("p", {
    className: `form-error ${message.success ? "form-error--ok" : ""}`
  }, message.success ? /*#__PURE__*/React.createElement(IconCheck, {
    size: 13
  }) : /*#__PURE__*/React.createElement(IconAlert, {
    size: 13
  }), " ", message.message));
}
