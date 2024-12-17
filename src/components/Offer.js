import React from 'react'
import './Offer.css'
import offer1 from '../images/offer1.png'
import offer2 from '../images/offer2.png'
import offer3 from '../images/offer3.png'

function Offer() {
  return (
    <div className='offer'>
        <p className='offer-heading'>Check these offers, made for you!</p>
        <div className='offer-div'>
            <div className='offer-card'>
                <img src={offer1} alt='Offer 1' className='offer-card-image'/>
                <h3 className='offer-card-heading'>Refer your Friends</h3>
                <p className='offer-card-subheading'>Get 100 SYOPI Points</p>
            </div>
            <div className='offer-card'>
                <img src={offer2} alt='Offer 2' className='offer-card-image'/>
                <h3 className='offer-card-heading'>Shop & Earn</h3>
                <p className='offer-card-subheading'>Earn 4% SYOPI points on every purchase</p>
            </div>
            <div className='offer-card'>
                <img src={offer3} alt='Offer 3' className='offer-card-image'/>
                <h3 className='offer-card-heading'>Use SYOPI Points</h3>
                <p className='offer-card-subheading'>Pay 4% of your Bill</p>
            </div>
        </div>
    </div>
  )
}

export default Offer;
