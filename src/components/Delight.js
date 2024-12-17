import React from 'react';
import './Delight.css';
import D1 from '../images/Delight1.png';
import D2 from '../images/Delight2.png';
import D3 from '../images/Delight3.png';
import D4 from '../images/Delight4.png';
import D5 from '../images/Delight5.png';
import D6 from '../images/Delight6.png';
import D7 from '../images/Delight3.png'; 
import D8 from '../images/Delight1.png';

function Delight() {
  const cards = [
    { image: D1, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D2, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D3, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D4, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D5, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D6, title: ' MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D7, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
    { image: D8, title: 'MIN. 65% OFF', description: '+EXTRA 10% OFF' },
  ];

  return (
    <div className='delight'>
        <p className='delight-heading'>Incredible Delights</p>
        <div className="delight-container">
          {cards.map((card, index) => (
            <div key={index} className="delight-card">
              <div className="delight-card-image-container">
                <img src={card.image} alt={`Card ${index + 1}`} className="delight-card-image" />
              </div>
              <h3 className="delight-card-title">{card.title}</h3>
              <p className="delight-card-description">{card.description}</p>
            </div>
          ))}
        </div>
    </div >
  );
}

export default Delight;
