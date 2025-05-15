import React from "react";
import "./Offer.css";
import { BASE_URL } from "../services/baseUrl";

function Offer({ offerData }) {

  return (
    <div className="offer">
      <p className="offer-heading">Check these offers, made for you!</p>
      <div className="offer-div">
        {offerData && offerData.map((offer) => (
          <div className="offer-card" key={offer._id}>
            <img
              src={`${BASE_URL}/uploads/${encodeURIComponent(offer.image)}`}
              alt={offer.title}
              className="offer-card-image"
            />
            <h3 className="offer-card-heading">{offer.title}</h3>
            <p className="offer-card-subheading">{offer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Offer;
