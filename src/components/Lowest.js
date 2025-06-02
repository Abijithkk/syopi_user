
import "./Lowest.css";
import { BASE_URL } from "../services/baseUrl";
import { useLocation, useNavigate } from "react-router-dom";

function Lowest({products}) {
  
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithKey = (url) => {
    const separator = url.includes('?') ? '&' : '?';
    const uniqueUrl = `${url}${separator}_k=${Date.now()}`;
    navigate(uniqueUrl);
  };

  const handleProductClick = (product) => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    
    let url = `/allproducts?minPrice=${product.startingPrice}`;
    
    if (currentSearch) {
      url += `&search=${currentSearch}`;
    }
    
    navigateWithKey(url);
  };

  return (
    <div className="lowest">
      <p className="lowestheading">Lowest Price Ever</p>
      <div className="lowest-cards-container">
        {products.map((card, index) => {
          const imageUrl = `${BASE_URL}/uploads/${encodeURIComponent(card.image)}`;
          
          return (
            <div
            className="lowest-card"
            key={index}
            onClick={() => handleProductClick(card)}
            style={{ backgroundImage: `url(${imageUrl})`,cursor:'pointer' }}
          >  
              <div className="lowest-card-content">
                <div className="lowest-text">
                  <p className="lowest-card-title">{card.description}</p>
                  <p className="lowest-card-sub-title">{card.startingPrice}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Lowest;