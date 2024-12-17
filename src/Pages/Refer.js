import React, { useState } from 'react';
import './refer.css';
import { Col, Row } from 'react-bootstrap';
import r1 from '../images/refer1.png';
import Header from '../components/Header';
import r2 from '../images/refer2.png';
import r3 from '../images/refer3.png';

function Refer() {
  const [copied, setCopied] = useState(false);

  const referralCode = "AUIJG231";
  const referralMessage = `Join Syopi and earn rewards! Use my referral code ${referralCode} to get 40 points on signup.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      })
      .catch(() => alert('Failed to copy!'));
  };

  const handleShare = (platform) => {
    const encodedMessage = encodeURIComponent(referralMessage);

    if (navigator.share) {
      navigator.share({
        title: 'Syopi Referral',
        text: referralMessage,
        url: window.location.href, 
      }).catch((error) => console.log('Sharing failed:', error));
    } else {
      let shareURL = '';
      switch (platform) {
        case 'telegram':
          shareURL = `https://t.me/share/url?url=${window.location.href}&text=${encodedMessage}`;
          break;
        case 'facebook':
          shareURL = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedMessage}`;
          break;
        case 'whatsapp':
          shareURL = `https://wa.me/?text=${encodedMessage}`;
          break;
        default:
          alert('Platform not supported for sharing');
          return;
      }
      window.open(shareURL, '_blank');
    }
  };

  return (
    <div>
      <Header />
      <div className="refer-div-1">
        <p className="refer-title-1">Refer your Friends and Earn</p>
        <p className="refer-des-1">
          Your friend gets 40 syopi points on signup and you get 100 syopi points for every referral
        </p>
        <Row className="refer-first-row">
          <Col className='refer-img'>
            <img src={r1} alt="Refer" style={{ width: '50%', borderRadius: '20px' }} />
          </Col>
          <Col>
            <div className="referal-code">
              <p>Your Referral Code</p>
              <p>{referralCode}</p>
            </div>
            <p className="copy-code" onClick={handleCopy}>
              <i className="fa-regular fa-copy me-2"></i>Copy Code
            </p>
          </Col>
        </Row>
        <p className="share-refer">Share your Referral Code Via</p>

        {/* Custom Toast */}
        {copied && (
          <div className="custom-toast">
            Referral Code Copied!
          </div>
        )}

        {/* Social Icons */}
        <div className="social-icons-container">
          <div className="social-icon bg-telegram" onClick={() => handleShare('telegram')}>
            <i className="fab fa-telegram"></i>
          </div>
          <div className="social-icon bg-facebook" onClick={() => handleShare('facebook')}>
            <i className="fab fa-facebook-f"></i>
          </div>
          <div className="social-icon bg-whatsapp" onClick={() => handleShare('whatsapp')}>
            <i className="fab fa-whatsapp"></i>
          </div>
        </div>
      </div>
      
      <div className="refer-div-2">
      <Row className="align-items-center">
  <Col md={5} style={{ marginLeft: '30px' }}>
    <img
      src={r2}
      style={{
        width: '100%',
        borderRadius: '20px',
       
      }}
      alt=""
      
    />
  </Col>
 <Col md={6}>
 <p className="refer-title2">Shop & Earn</p>
 <p className="refer-des2">
   Your friend gets 40 syopi points on signup, and you get 100 syopi points for every referral.
 </p>
 <p className="refer-des2">How it works?</p>
 <ul className="refer-des2" style={{paddingLeft:'16px'}}>
   <li>You earn points for every purchase</li>
   <li>Each point is worth 1 rupee, which can be used when buying items</li>
   <li>For example, 40 points give you 40 rupees to use on your next purchase</li>
 </ul>
</Col>

</Row>


      </div>
      <div className="refer-div-3">
      <Row className="align-items-center">
  <Col md={5} style={{ marginLeft: '30px' }}>
    <img
      src={r3}
      style={{
        width: '100%',
        borderRadius: '20px',
       
      }}
      alt=""
      
    />
  </Col>
  <Col md={6} >
    <p className="refer-title2">Use SYOPI Points</p>
    
    <p className="refer-des2">How to Use SYOPI Points</p>
    <ul className="refer-des2" style={{paddingLeft:'16px'}}>
       <li>Earn Points: You get points with every purchase you make at Syopi.</li> 
       <li>Check Your Points: The points are saved in your account and can be seen anytime. </li>
      <li>Redeem Points: When buying something next time, you can use your points like cash.</li>
     <li>1 Point = 1 Rupee: For example, if you have 40 points, you can use them as 40 rupees on your purchase.</li>
    </ul>
  </Col>
</Row>


      </div>
    </div>
  );
}

export default Refer;
