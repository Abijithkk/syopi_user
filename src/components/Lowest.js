import "./Lowest.css";
import { BASE_URL } from "../services/baseUrl";

function Lowest({products}) {
  console.log("lowest", products);
  

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
            style={{ backgroundImage: `url(${imageUrl})` }}
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