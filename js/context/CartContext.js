/* ============================================================================
   CartContext.jsx — Carrito global + CouponManager
============================================================================ */

const CartContext = createContext(null);
function CartProvider({
  children
}) {
  const [items, setItems] = useState([]); // { id, name, price, qty, material, fileType }
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
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

  /* ---------------- CouponManager: algoritmo de decremento y eliminación ---------------- */
  const applyCoupon = useCallback(rawCode => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return {
        success: false,
        message: "Ingresá un código de cupón."
      };
    }
    if (appliedCoupon) {
      return {
        success: false,
        message: `Ya tenés el cupón ${appliedCoupon.code} aplicado. Quitalo para usar otro.`
      };
    }
    const found = coupons.find(c => c.code === code);
    if (!found) {
      return {
        success: false,
        message: "El cupón no existe o ya no está disponible."
      };
    }
    if (found.usableCount <= 0) {
      // Salvaguarda: nunca debería ocurrir porque el cupón se elimina al llegar a 0.
      setCoupons(prev => prev.filter(c => c.code !== code));
      return {
        success: false,
        message: "Este cupón ya alcanzó su límite de usos."
      };
    }

    // Se aplica el cupón y se descuenta 1 uso disponible.
    const newCount = found.usableCount - 1;
    setCoupons(prev => {
      if (newCount <= 0) {
        // Al llegar a 0 usos disponibles, el cupón se elimina del sistema por completo.
        return prev.filter(c => c.code !== code);
      }
      return prev.map(c => c.code === code ? {
        ...c,
        usableCount: newCount
      } : c);
    });
    setAppliedCoupon({
      code: found.code,
      discountPercentage: found.discountPercentage
    });
    return {
      success: true,
      message: newCount > 0 ? `Cupón ${found.code} aplicado (-${found.discountPercentage}%). Quedan ${newCount} usos.` : `Cupón ${found.code} aplicado (-${found.discountPercentage}%). Era el último uso disponible: se agotó.`
    };
  }, [coupons, appliedCoupon]);
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
      coupons,
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
