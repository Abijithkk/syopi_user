import './Toppicks.css';
import Ts1 from '../images/Ts1.jpeg';
import Ts2 from '../images/Ts2.jpeg';
import Ts3 from '../images/Ts3.jpeg';
import Ts4 from '../images/Ts4.jpeg';

function Toppicks() {

  const products = [
    { id: 1, image: Ts1, title: 'Flash Sale' },
    { id: 2, image: Ts2, title: 'Flash Sale' },
    { id: 3, image: Ts3, title: 'Flash Sale' },
    { id: 4, image: Ts4, title: 'Flash Sale' },
    { id: 5, image: 'image5.jpg', title: 'Flash Sale' },
    { id: 6, image: 'image6.jpg', title: 'Flash Sale' },
  ];

  return (
    <div className="Toppicks">
      <p className='Toppicksheading1'>Your top picks in the best price</p>
      <div className="Toppicks-card-row">
        {products.map((product) => (
          <div className="Toppicks-card" key={product.id}>
            <div className="Toppicks-card-image-container">
              <img src={product.image} alt={product.title} className="Toppicks-card-image" />
              <div className="card-text-overlay">
                <p className='Toppicksheading'>{product.title}</p>
                <p className='Toppickssubheading'>Men's Outfit</p>
              </div>
            </div>
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

export default Toppicks;
