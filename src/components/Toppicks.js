import "./Toppicks.css";
import { BASE_URL } from "../services/baseUrl";

function Toppicks({ products }) {
  console.log("top-picks", products);

  return (
    <div className="Toppicks">
      <p className="Toppicksheading1">Your top picks in the best price</p>
      <div className="Toppicks-card-row">
        {products.map((product) => (
          <div className="Toppicks-card" key={product.id}>
            <div className="Toppicks-card-image-container">
              <img
                src={`${BASE_URL}/uploads/${product.image}`}
                alt={product.title}
                className="Toppicks-card-image"
              />
              <div className="card-text-overlay">
                <p className="Toppicksheading">{product.title}</p>
                <p className="Toppickssubheading">{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="product-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        &#10094;
      </button>
      <button
        className="product-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        &#10095;
      </button>
    </div>
  );
}

export default Toppicks;
