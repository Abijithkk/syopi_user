import React from "react";
import "./Lowest.css";
import lbg1 from "../images/lbg1.png";
import lbg2 from "../images/lbg2.png";
import lbg3 from "../images/lbg3.png";
import lbg4 from "../images/lbg4.png";
import lbg5 from "../images/lbg5.png";
import lbg6 from "../images/lbg6.png";
import l1 from "../images/l1.png";
import l2 from "../images/l2.png";
import l3 from "../images/l3.png";
import l4 from "../images/l4.png";
import l5 from "../images/l5.png";
import l6 from "../images/l6.png";

const cardsData = [
  { background: lbg1, image: l1, title: "Amazing Offer 1", subtitle: "Lowest Price Ever" },
  { background: lbg2, image: l2, title: "Incredible Deal 2", subtitle: "Discounts Galore" },
  { background: lbg3, image: l3, title: "Best Value 3", subtitle: "Limited Time Offer" },
  { background: lbg4, image: l4, title: "Steal Deal 4", subtitle: "Exclusive Offers" },
  { background: lbg5, image: l5, title: "Hot Offer 5", subtitle: "Prices Slashed" },
  { background: lbg6, image: l6, title: "Unbeatable Deal 6", subtitle: "Don't Miss Out" },
];

function Lowest() {
  return (
    <div className="lowest">
      <p className="lowestheading">Lowest Price Ever</p>
      <div className="lowest-cards-container">
        {cardsData.map((card, index) => (
          <div
            className="lowest-card"
            key={index}
            style={{ backgroundImage: `url(${card.background})` }}
          >
            <div className="lowest-card-content">
              <div className="lowest-text">
                <p className="lowest-card-title">{card.title}</p>
                <p className="lowest-card-sub-title">{card.subtitle}</p>
              </div>
              <img src={card.image} alt="Card" className="lowest-card-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lowest;
