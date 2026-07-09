/* ============================================================================
   AuthContext.jsx — Autenticación simulada + verificación de cuenta +
   cuenta bancaria (simulada) + rol de administrador.

   Nota honesta: no hay backend real. La verificación de email "envía" un
   código que se muestra en pantalla (no llega ningún email real), y la
   cuenta bancaria es un mock — guarda solo un alias y los últimos 4
   dígitos, nunca el número completo. Para producción hace falta un backend
   + un procesador de pagos habilitado (Mercado Pago, Stripe Connect, etc.)
   para la parte bancaria, y un servicio de email (Resend, SendGrid) para
   los códigos de verificación reales.
============================================================================ */

const AuthContext = createContext(null);

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, password) => {
    if (!email || !password) return { success: false, message: "Completá todos los campos." };
    if (password.length < 6) return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    const name = email.split("@")[0].replace(/[._]/g, " ");
    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      isAdmin: email.toLowerCase().includes("admin"),
      verified: false,
      pendingCode: null,
      bankAccount: null,
    });
    return { success: true };
  }, []);

  const register = useCallback((name, email, password) => {
    if (!name || !email || !password) return { success: false, message: "Completá todos los campos." };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { success: false, message: "Ingresá un email válido." };
    if (password.length < 6) return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    setUser({
      name,
      email,
      isAdmin: email.toLowerCase().includes("admin"),
      verified: false,
      pendingCode: null,
      bankAccount: null,
    });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  /* ---------------- Verificación de cuenta (simulada) ---------------- */
  const sendVerificationCode = useCallback(() => {
    const code = generateCode();
    setUser((prev) => (prev ? { ...prev, pendingCode: code } : prev));
    return code;
  }, []);

  const verifyEmail = useCallback(
    (inputCode) => {
      if (!user || !user.pendingCode) return { success: false, message: "Primero pedí un código de verificación." };
      if (inputCode.trim() !== user.pendingCode) return { success: false, message: "El código no coincide." };
      setUser((prev) => ({ ...prev, verified: true, pendingCode: null }));
      return { success: true, message: "Cuenta verificada correctamente." };
    },
    [user]
  );

  /* ---------------- Cuenta bancaria (simulada, solo para demo) ---------------- */
  const linkBankAccount = useCallback((holder, bankName, accountNumber) => {
    if (!holder || !bankName || !accountNumber) return { success: false, message: "Completá todos los campos." };
    const digits = accountNumber.replace(/\D/g, "");
    if (digits.length < 8) return { success: false, message: "Ingresá un número de cuenta/CBU válido." };
    setUser((prev) => ({
      ...prev,
      bankAccount: { holder, bankName, last4: digits.slice(-4) },
    }));
    return { success: true, message: "Cuenta bancaria vinculada." };
  }, []);

  const unlinkBankAccount = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, bankAccount: null } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        sendVerificationCode,
        verifyEmail,
        linkBankAccount,
        unlinkBankAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}
