import React from 'react'
import { Col, Row } from 'react-bootstrap'
import r2 from "../images/refer2.png";

function Earn() {
  return (
    <div>
         <div className="refer-div-2">
        <Row className="align-items-center">
          <Col md={5} style={{ marginLeft: "30px" }}>
            <img
              src={r2}
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              alt=""
            />
          </Col>
          <Col md={6}>
            <p className="refer-title2">Shop & Earn</p>
            <p className="refer-des2">
              Your friend gets 40 syopi points on signup, and you get 100 syopi
              points for every referral.
            </p>
            <p className="refer-des2">How it works?</p>
            <ul className="refer-des2" style={{ paddingLeft: "16px" }}>
              <li>You earn points for every purchase</li>
              <li>
                Each point is worth 1 rupee, which can be used when buying items
              </li>
              <li>
                For example, 40 points give you 40 rupees to use on your next
                purchase
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Earn