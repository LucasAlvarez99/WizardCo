/* ============================================================================
   AuthContext.jsx — Autenticación simulada (sin backend real)
============================================================================ */

const AuthContext = createContext(null);
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
      orders: 3
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
      orders: 0
    });
    return {
      success: true
    };
  }, []);
  const logout = useCallback(() => setUser(null), []);
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: {
      user,
      login,
      register,
      logout
    }
  }, children);
}
function useAuth() {
  return useContext(AuthContext);
}
