/* ============================================================================
   AdminDataContext.jsx — productos, cupones y pedidos: todo contra la API
   real (MongoDB Atlas vía /server), protegido con el token de sesión de
   AuthContext donde corresponde. Solo "contact" (a dónde llegan los avisos
   de venta) sigue en localStorage.
============================================================================ */

const AdminDataContext = createContext(null);
const LS_KEYS = {
  contact: "wizardco_contact"
};
function AdminDataProvider({
  children
}) {
  const {
    token,
    user
  } = useAuth();
  const isAdmin = !!(user && user.isAdmin);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponsError, setCouponsError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrdersError, setMyOrdersError] = useState("");
  const [contact, setContact] = useState(() => loadJSON(LS_KEYS.contact, DEFAULT_ADMIN_CONTACT));
  useEffect(() => saveJSON(LS_KEYS.contact, contact), [contact]);

  /* ---------------- Productos (API real) ---------------- */
  // Lectura es pública (no necesita token); crear/editar/borrar requiere
  // sesión de administrador — el backend lo exige igual aunque alguien
  // intente saltarse la UI, esto es solo para dar buen feedback acá.

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");
    try {
      const data = await apiRequest("/api/products");
      setProducts(data);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const addProduct = useCallback(async product => {
    setProductsError("");
    try {
      const created = await apiRequest("/api/products", {
        method: "POST",
        token,
        body: product
      });
      setProducts(prev => [created, ...prev]);
      return {
        success: true
      };
    } catch (err) {
      setProductsError(err.message);
      return {
        success: false,
        message: err.message
      };
    }
  }, [token]);
  const updateProduct = useCallback(async (id, patch) => {
    // Actualización optimista: se ve al toque en la tabla, y se revierte si falla.
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      ...patch
    } : p));
    try {
      const updated = await apiRequest(`/api/products/${id}`, {
        method: "PUT",
        token,
        body: patch
      });
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return {
        success: true
      };
    } catch (err) {
      setProductsError(err.message);
      fetchProducts(); // revertir al estado real del server
      return {
        success: false,
        message: err.message
      };
    }
  }, [token, fetchProducts]);
  const deleteProduct = useCallback(async id => {
    const previous = products;
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE",
        token
      });
      return {
        success: true
      };
    } catch (err) {
      setProductsError(err.message);
      setProducts(previous); // revertir
      return {
        success: false,
        message: err.message
      };
    }
  }, [token, products]);

  /* ---------------- Cupones (CouponManager) ----------------
     Listar/crear/borrar requiere admin. Aplicar un cupón en el checkout
     solo requiere estar logueado (cualquier usuario). */

  const fetchCoupons = useCallback(async () => {
    if (!token) return;
    setCouponsLoading(true);
    setCouponsError("");
    try {
      const data = await apiRequest("/api/coupons", {
        token
      });
      setCoupons(data);
    } catch (err) {
      setCouponsError(err.message);
    } finally {
      setCouponsLoading(false);
    }
  }, [token]);
  useEffect(() => {
    if (isAdmin) fetchCoupons();else setCoupons([]);
  }, [isAdmin, fetchCoupons]);
  const addCoupon = useCallback(async coupon => {
    try {
      const created = await apiRequest("/api/coupons", {
        method: "POST",
        token,
        body: {
          code: coupon.code.trim().toUpperCase(),
          discountPercentage: Number(coupon.discountPercentage),
          usableCount: Number(coupon.usableCount)
        }
      });
      setCoupons(prev => [created, ...prev]);
      return {
        success: true,
        message: "Cupón creado."
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }, [token]);
  const deleteCoupon = useCallback(async code => {
    const previous = coupons;
    setCoupons(prev => prev.filter(c => c.code !== code));
    try {
      await apiRequest(`/api/coupons/${code}`, {
        method: "DELETE",
        token
      });
      return {
        success: true
      };
    } catch (err) {
      setCoupons(previous);
      return {
        success: false,
        message: err.message
      };
    }
  }, [token, coupons]);

  // Llamado desde el checkout (CartContext). Requiere estar logueado, pero
  // no ser admin — el decremento de usos es atómico del lado del server.
  const applyCoupon = useCallback(async rawCode => {
    const code = rawCode.trim();
    if (!code) return {
      success: false,
      message: "Ingresá un código de cupón."
    };
    try {
      const result = await apiRequest("/api/coupons/apply", {
        method: "POST",
        token,
        body: {
          code
        }
      });
      return {
        success: true,
        ...result
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }, [token]);

  /* ---------------- Pedidos ----------------
     "orders" (todos) es para el panel de administración (admin). "myOrders"
     es para el historial de compras del usuario logueado. */

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      setOrders(await apiRequest("/api/orders", {
        token
      }));
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);
  useEffect(() => {
    if (isAdmin) fetchOrders();else setOrders([]);
  }, [isAdmin, fetchOrders]);
  const fetchMyOrders = useCallback(async () => {
    if (!token) return;
    setMyOrdersLoading(true);
    setMyOrdersError("");
    try {
      setMyOrders(await apiRequest("/api/orders/mine", {
        token
      }));
    } catch (err) {
      setMyOrdersError(err.message);
    } finally {
      setMyOrdersLoading(false);
    }
  }, [token]);
  useEffect(() => {
    if (token) fetchMyOrders();else setMyOrders([]);
  }, [token, fetchMyOrders]);

  // Crea el pedido (estado "pending_payment") ANTES de redirigir a Mercado
  // Pago — así el webhook tiene un pedido real para actualizar cuando
  // confirme el pago, sin depender de que la persona vuelva al navegador.
  const createOrder = useCallback(async orderData => {
    try {
      const order = await apiRequest("/api/orders", {
        method: "POST",
        token,
        body: orderData
      });
      return {
        success: true,
        order
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }, [token]);

  // Usado en la pantalla de "volviste de Mercado Pago" para traer el estado
  // real y actualizado del pedido (el webhook puede tardar unos segundos).
  const getOrderByReference = useCallback(async ref => {
    try {
      const order = await apiRequest(`/api/orders/by-reference/${ref}`, {
        token
      });
      return {
        success: true,
        order
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }, [token]);

  /* ---------------- Configuración de contacto (notificaciones de venta) ---------------- */
  const updateContact = useCallback(patch => {
    setContact(prev => ({
      ...prev,
      ...patch
    }));
  }, []);
  return /*#__PURE__*/React.createElement(AdminDataContext.Provider, {
    value: {
      products,
      productsLoading,
      productsError,
      refetchProducts: fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      coupons,
      couponsLoading,
      couponsError,
      addCoupon,
      deleteCoupon,
      applyCoupon,
      orders,
      ordersLoading,
      ordersError,
      refetchOrders: fetchOrders,
      myOrders,
      myOrdersLoading,
      myOrdersError,
      createOrder,
      getOrderByReference,
      contact,
      updateContact
    }
  }, children);
}
function useAdminData() {
  return useContext(AdminDataContext);
}
