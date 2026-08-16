/* ============================================================================
   AdminDataContext.jsx — productos (API real contra MongoDB Atlas vía
   /server), cupones, pedidos y contacto del admin (estos tres últimos
   siguen en localStorage por ahora — se migran en una fase aparte).
============================================================================ */

const AdminDataContext = createContext(null);
const LS_KEYS = {
  coupons: "wizardco_coupons",
  orders: "wizardco_orders",
  contact: "wizardco_contact"
};
function AdminDataProvider({
  children
}) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [coupons, setCoupons] = useState(() => loadJSON(LS_KEYS.coupons, INITIAL_COUPONS));
  const [orders, setOrders] = useState(() => loadJSON(LS_KEYS.orders, []));
  const [contact, setContact] = useState(() => loadJSON(LS_KEYS.contact, DEFAULT_ADMIN_CONTACT));
  useEffect(() => saveJSON(LS_KEYS.coupons, coupons), [coupons]);
  useEffect(() => saveJSON(LS_KEYS.orders, orders), [orders]);
  useEffect(() => saveJSON(LS_KEYS.contact, contact), [contact]);

  /* ---------------- Productos (API real) ---------------- */

  // Mensaje consistente con el que ya usa CheckoutView.jsx para el mismo tipo de error.
  function networkErrorMessage(err) {
    if (err instanceof TypeError) {
      return `No se pudo contactar al backend en ${API_BASE_URL}. Si estás en local, revisá que corriste "npm start" dentro de /server. Si este sitio está desplegado, revisá API_BASE_URL en src/data/config.js.`;
    }
    return err.message || "Ocurrió un error inesperado.";
  }
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Error ${response.status} al cargar productos.`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setProductsError(networkErrorMessage(err));
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
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se pudo crear el producto.");
      setProducts(prev => [body, ...prev]);
      return {
        success: true
      };
    } catch (err) {
      const message = networkErrorMessage(err);
      setProductsError(message);
      return {
        success: false,
        message
      };
    }
  }, []);
  const updateProduct = useCallback(async (id, patch) => {
    // Actualización optimista: se ve al toque en la tabla, y se revierte si falla.
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      ...patch
    } : p));
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se pudo actualizar el producto.");
      setProducts(prev => prev.map(p => p.id === id ? body : p));
      return {
        success: true
      };
    } catch (err) {
      const message = networkErrorMessage(err);
      setProductsError(message);
      fetchProducts(); // revertir al estado real del server
      return {
        success: false,
        message
      };
    }
  }, [fetchProducts]);
  const deleteProduct = useCallback(async id => {
    const previous = products;
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE"
      });
      if (!response.ok && response.status !== 204) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo eliminar el producto.");
      }
      return {
        success: true
      };
    } catch (err) {
      const message = networkErrorMessage(err);
      setProductsError(message);
      setProducts(previous); // revertir
      return {
        success: false,
        message
      };
    }
  }, [products]);

  /* ---------------- Cupones (CouponManager) ---------------- */
  const addCoupon = useCallback(coupon => {
    const code = coupon.code.trim().toUpperCase();
    let result = {
      success: true,
      message: "Cupón creado."
    };
    setCoupons(prev => {
      if (prev.some(c => c.code === code)) {
        result = {
          success: false,
          message: "Ya existe un cupón con ese código."
        };
        return prev;
      }
      return [...prev, {
        code,
        discountPercentage: Number(coupon.discountPercentage),
        usableCount: Number(coupon.usableCount)
      }];
    });
    return result;
  }, []);
  const deleteCoupon = useCallback(code => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  }, []);

  // Algoritmo de decremento y eliminación automática al agotarse los usos.
  const applyCoupon = useCallback(rawCode => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return {
      success: false,
      message: "Ingresá un código de cupón."
    };
    const found = coupons.find(c => c.code === code);
    if (!found) return {
      success: false,
      message: "El cupón no existe o ya no está disponible."
    };
    if (found.usableCount <= 0) {
      setCoupons(prev => prev.filter(c => c.code !== code));
      return {
        success: false,
        message: "Este cupón ya alcanzó su límite de usos."
      };
    }
    const newCount = found.usableCount - 1;
    setCoupons(prev => newCount <= 0 ? prev.filter(c => c.code !== code) : prev.map(c => c.code === code ? {
      ...c,
      usableCount: newCount
    } : c));
    return {
      success: true,
      discountPercentage: found.discountPercentage,
      code: found.code,
      message: newCount > 0 ? `Cupón ${found.code} aplicado (-${found.discountPercentage}%). Quedan ${newCount} usos.` : `Cupón ${found.code} aplicado (-${found.discountPercentage}%). Era el último uso disponible: se agotó.`
    };
  }, [coupons]);

  /* ---------------- Pedidos (para el panel de administración y el perfil) ---------------- */
  const logOrder = useCallback(order => {
    setOrders(prev => [{
      id: `WZ-${Date.now()}`,
      date: new Date().toISOString(),
      ...order
    }, ...prev]);
  }, []);

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
      addCoupon,
      deleteCoupon,
      applyCoupon,
      orders,
      logOrder,
      contact,
      updateContact
    }
  }, children);
}
function useAdminData() {
  return useContext(AdminDataContext);
}
