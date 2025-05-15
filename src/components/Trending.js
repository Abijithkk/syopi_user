import './trending.css';
import tr1 from '../images/tr1.jpeg';
import tr2 from '../images/tr2.jpeg';
import tr3 from '../images/tr3.jpeg';
import tr4 from '../images/tr4.jpeg';
import { BASE_URL } from '../services/baseUrl';


function Trending({products}) {
console.log("trending",products);

  const products3 = [
    { id: 1, image: tr1, title: 'Product 1', description: 'This is product 1' },
    { id: 2, image: tr2, title: 'Product 2', description: 'This is product 2' },
    { id: 3, image: tr3, title: 'Product 3', description: 'This is product 3' },
    { id: 4, image: tr4, title: 'Product 4', description: 'This is product 4' },
    { id: 5, image: 'image5.jpg', title: 'Product 5', description: 'This is product 5' },
    { id: 6, image: 'image6.jpg', title: 'Product 6', description: 'This is product 6' },
  ];


  return (
    <div className="trending">
      <p className="trendingheading">Trending deals under 1000₹</p>
      <div className="trending-card-row">
        {products.map((product) => (
          <div className="trending-card" key={product.id}>
            <div className="trending-card-image-container">
              <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title} className="trending-card-image" />
             
            </div>
            <p className="trending-card-title">{product.description}</p>
            <p className="trending-card-description">From {product.affordablePrice}</p>
          </div>
        ))}
      </div>
      <button className="product-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          &#10094;
        </button>
        <button className="product-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          &#10095;
        </button>
    </div>
  );
}

export default Trending;
