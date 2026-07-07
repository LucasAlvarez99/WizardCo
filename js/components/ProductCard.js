/* ============================================================================
   ProductCard.jsx
============================================================================ */

function ProductCard({
  product,
  onAdd
}) {
  const [added, setAdded] = useState(false);
  const finalPrice = priceWithDiscount(product);
  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "product-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: `product-card__media ${product.gradient}`
  }, /*#__PURE__*/React.createElement(IconPrinter, {
    size: 40,
    strokeWidth: 1.5
  }), product.discount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "product-card__badge-discount"
  }, "-", product.discount, "%"), /*#__PURE__*/React.createElement("span", {
    className: "product-card__badge-type"
  }, product.fileType === "stl" ? "Archivo STL" : "Físico")), /*#__PURE__*/React.createElement("div", {
    className: "product-card__body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "product-card__material"
  }, product.material), /*#__PURE__*/React.createElement("h3", {
    className: "product-card__title line-clamp-2"
  }, product.name), /*#__PURE__*/React.createElement("div", {
    className: "product-card__price-row"
  }, product.discount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "price-old"
  }, formatCurrency(product.price)), /*#__PURE__*/React.createElement("span", {
    className: "price-final"
  }, formatCurrency(finalPrice))), product.freeShipping && /*#__PURE__*/React.createElement("p", {
    className: "shipping-free"
  }, /*#__PURE__*/React.createElement(IconTruck, {
    size: 13
  }), " Env\xEDo gratis"), /*#__PURE__*/React.createElement("div", {
    className: "rating-row"
  }, /*#__PURE__*/React.createElement(IconStar, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, product.rating), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, product.sales, " vendidos")), /*#__PURE__*/React.createElement("div", {
    className: "seller-row"
  }, /*#__PURE__*/React.createElement(IconShield, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, product.seller)), /*#__PURE__*/React.createElement("button", {
    className: `btn-add-cart ${added ? "btn-add-cart--added" : ""}`,
    onClick: handleAdd
  }, added ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconCheck, {
    size: 16
  }), " Agregado") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconCart, {
    size: 16
  }), " Agregar al carrito"))));
}
