/* ============================================================================
   AuthContext.jsx — Autenticación simulada + verificación de cuenta +
   rol de administrador.

   Nota honesta: no hay backend real de emails. La verificación "envía" un
   código que se muestra en pantalla (no llega ningún email real). Para
   producción hace falta un backend + un servicio de email (Resend,
   SendGrid) para los códigos de verificación reales.

   El pago (antes acá como "cuenta bancaria simulada") ahora se procesa de
   verdad en cada compra vía Mercado Pago Checkout Pro — ver
   CheckoutView.jsx y /server. Por eso este contexto ya no guarda ningún
   dato bancario.
============================================================================ */

const AuthContext = createContext(null);
function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const login = useCallback((email, password) => {
    if (!email || !password) return {
      success: false,
      message: "Completá todos los campos."
    };
    if (password.length < 6) return {
      success: false,
      message: "La contraseña debe tener al menos 6 caracteres."
    };
    const name = email.split("@")[0].replace(/[._]/g, " ");
    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      isAdmin: email.toLowerCase().includes("admin"),
      verified: false,
      pendingCode: null
    });
    return {
      success: true
    };
  }, []);
  const register = useCallback((name, email, password) => {
    if (!name || !email || !password) return {
      success: false,
      message: "Completá todos los campos."
    };
    if (!/^\S+@\S+\.\S+$/.test(email)) return {
      success: false,
      message: "Ingresá un email válido."
    };
    if (password.length < 6) return {
      success: false,
      message: "La contraseña debe tener al menos 6 caracteres."
    };
    setUser({
      name,
      email,
      isAdmin: email.toLowerCase().includes("admin"),
      verified: false,
      pendingCode: null
    });
    return {
      success: true
    };
  }, []);
  const logout = useCallback(() => setUser(null), []);

  /* ---------------- Verificación de cuenta (simulada) ---------------- */
  const sendVerificationCode = useCallback(() => {
    const code = generateCode();
    setUser(prev => prev ? {
      ...prev,
      pendingCode: code
    } : prev);
    return code;
  }, []);
  const verifyEmail = useCallback(inputCode => {
    if (!user || !user.pendingCode) return {
      success: false,
      message: "Primero pedí un código de verificación."
    };
    if (inputCode.trim() !== user.pendingCode) return {
      success: false,
      message: "El código no coincide."
    };
    setUser(prev => ({
      ...prev,
      verified: true,
      pendingCode: null
    }));
    return {
      success: true,
      message: "Cuenta verificada correctamente."
    };
  }, [user]);
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: {
      user,
      login,
      register,
      logout,
      sendVerificationCode,
      verifyEmail
    }
  }, children);
}
function useAuth() {
  return useContext(AuthContext);
}
