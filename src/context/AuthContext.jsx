/* ============================================================================
   AuthContext.jsx — Autenticación real contra /server (JWT + bcrypt) y
   verificación de cuenta por email real (Resend).

   La sesión se guarda en localStorage como un JWT (wizardco_token). Al
   cargar la app, si hay un token guardado, se valida contra el backend
   (GET /api/auth/me) para hidratar el usuario — así una sesión vieja o
   vencida no deja a la persona "logueada" con datos desactualizados.
============================================================================ */

const AuthContext = createContext(null);

const TOKEN_KEY = "wizardco_token";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(true);

  // Al montar (o si cambia el token), valida la sesión contra el backend.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }
      setAuthLoading(true);
      try {
        const data = await apiRequest("/api/auth/me", { token });
        if (!cancelled) setUser(data.user);
      } catch (err) {
        // Token vencido/inválido, o el backend no está disponible: se
        // limpia la sesión local para no mostrar un estado inconsistente.
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiRequest("/api/auth/login", { method: "POST", body: { email, password } });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await apiRequest("/api/auth/register", { method: "POST", body: { name, email, password } });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /* ---------------- Verificación de cuenta (email real vía Resend) ---------------- */
  const sendVerificationCode = useCallback(async () => {
    try {
      const data = await apiRequest("/api/auth/send-verification", { method: "POST", token });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [token]);

  const verifyEmail = useCallback(
    async (inputCode) => {
      try {
        const data = await apiRequest("/api/auth/verify-email", {
          method: "POST",
          token,
          body: { code: inputCode },
        });
        setUser(data.user);
        return { success: true, message: data.message };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        login,
        register,
        logout,
        sendVerificationCode,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}
