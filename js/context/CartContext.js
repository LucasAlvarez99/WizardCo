/* ============================================================================
   CartContext.jsx — Carrito global.
   El CouponManager (alta, decremento y expiración) ahora vive en
   AdminDataContext, porque los cupones se administran desde el panel de
   administración. Este contexto solo aplica/retira el cupón en la sesión
   de compra actual.
============================================================================ */

const CartContext = createContext(null);
function CartProvider({
  children
}) {
  const {
    applyCoupon: applyCouponGlobal
  } = useAdminData();
  const [items, setItems] = useState([]); // { id, name, price, qty, material, fileType }
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const addToCart = useCallback(product => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? {
          ...i,
          qty: i.qty + 1
        } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: priceWithDiscount(product),
        material: product.material,
        fileType: product.fileType,
        qty: 1
      }];
    });
  }, []);
  const removeFromCart = useCallback(id => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);
  const updateQty = useCallback((id, delta) => {
    setItems(prev => prev.map(i => i.id === id ? {
      ...i,
      qty: Math.max(1, i.qty + delta)
    } : i).filter(i => i.qty > 0));
  }, []);
  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);
  const applyCoupon = useCallback(rawCode => {
    if (appliedCoupon) {
      return {
        success: false,
        message: `Ya tenés el cupón ${appliedCoupon.code} aplicado. Quitalo para usar otro.`
      };
    }
    const result = applyCouponGlobal(rawCode);
    if (result.success) {
      setAppliedCoupon({
        code: result.code,
        discountPercentage: result.discountPercentage
      });
    }
    return result;
  }, [appliedCoupon, applyCouponGlobal]);
  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = appliedCoupon ? subtotal * (appliedCoupon.discountPercentage / 100) : 0;
    const taxableBase = subtotal - discountAmount;
    const tax = taxableBase * TAX_RATE;
    const total = taxableBase + tax;
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    return {
      subtotal,
      discountAmount,
      tax,
      total,
      itemCount
    };
  }, [items, appliedCoupon]);
  return /*#__PURE__*/React.createElement(CartContext.Provider, {
    value: {
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      totals
    }
  }, children);
}
function useCart() {
  return useContext(CartContext);
}
