/* ============================================================================
   AdminDataContext.jsx — productos, cupones, pedidos y contacto del admin.
   Todo se persiste en localStorage (sin backend). El CouponManager vive acá
   porque los cupones ahora son editables desde el panel de administración.
============================================================================ */

const AdminDataContext = createContext(null);
const LS_KEYS = {
  products: "wizardco_products",
  coupons: "wizardco_coupons",
  orders: "wizardco_orders",
  contact: "wizardco_contact"
};
function AdminDataProvider({
  children
}) {
  const [products, setProducts] = useState(() => loadJSON(LS_KEYS.products, PRODUCTS));
  const [coupons, setCoupons] = useState(() => loadJSON(LS_KEYS.coupons, INITIAL_COUPONS));
  const [orders, setOrders] = useState(() => loadJSON(LS_KEYS.orders, []));
  const [contact, setContact] = useState(() => loadJSON(LS_KEYS.contact, DEFAULT_ADMIN_CONTACT));
  useEffect(() => saveJSON(LS_KEYS.products, products), [products]);
  useEffect(() => saveJSON(LS_KEYS.coupons, coupons), [coupons]);
  useEffect(() => saveJSON(LS_KEYS.orders, orders), [orders]);
  useEffect(() => saveJSON(LS_KEYS.contact, contact), [contact]);

  /* ---------------- Productos ---------------- */
  const addProduct = useCallback(product => {
    setProducts(prev => {
      const nextId = prev.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      return [...prev, {
        ...product,
        id: nextId
      }];
    });
  }, []);
  const updateProduct = useCallback((id, patch) => {
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      ...patch
    } : p));
  }, []);
  const deleteProduct = useCallback(id => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

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
