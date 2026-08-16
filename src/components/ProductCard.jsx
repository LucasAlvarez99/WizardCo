/* ============================================================================
   ProductCard.jsx
============================================================================ */

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const finalPrice = priceWithDiscount(product);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="product-card">
      <div className={`product-card__media ${product.gradient}`}>
        <IconPrinter size={40} strokeWidth={1.5} />
        {product.discount > 0 && (
          <span className="product-card__badge-discount">-{product.discount}%</span>
        )}
        <span className="product-card__badge-type">
          {product.fileType === "stl" ? "Archivo STL" : "Físico"}
        </span>
      </div>

      <div className="product-card__body">
        <p className="product-card__material">{product.material}</p>
        <h3 className="product-card__title line-clamp-2">{product.name}</h3>

        <div className="product-card__price-row">
          {product.discount > 0 && (
            <span className="price-old">{formatCurrency(product.price)}</span>
          )}
          <span className="price-final">{formatCurrency(finalPrice)}</span>
        </div>

        {product.freeShipping && (
          <p className="shipping-free"><IconTruck size={13} /> Envío gratis</p>
        )}

        <div className="rating-row">
          <IconStar size={13} />
          <span>{product.rating}</span>
          <span className="dot">·</span>
          <span>{product.sales} vendidos</span>
        </div>

        <div className="seller-row">
          <IconShield size={13} />
          <span>{product.seller}</span>
        </div>

        <button
          className={`btn-add-cart ${added ? "btn-add-cart--added" : ""}`}
          onClick={handleAdd}
        >
          {added ? (
            <React.Fragment><IconCheck size={16} /> Agregado</React.Fragment>
          ) : (
            <React.Fragment><IconCart size={16} /> Agregar al carrito</React.Fragment>
          )}
        </button>
      </div>
    </div>
  );
}
