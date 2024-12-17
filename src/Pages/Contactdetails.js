import React from 'react'
import './contactdetails.css'
import Header from '../components/Header'
import cd from '../images/cd.png'
import { Col, Form, Row } from 'react-bootstrap'
function Contactdetails() {
  return (
    <div>
        <Header></Header>
        <p className='contact-details-title mt-5'>Account Details</p>
        <div className='contact-details-form'>
        <Form className='mt-3 p-4'>
        <div className="contact-details-container">
  <img className="contact-details-img" src={cd} alt="Profile" />
  <button className="edit-profile-button">Edit Profile</button>
</div>

                <Row className='mt-4'>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Group controlId="firstName">
                      <Form.Label className='form-head'>First Name</Form.Label>
                      <Form.Control type="text"  className='custom-placeholder' placeholder='sample' style={{ border: '1px solid #9F9F9F', borderRadius: '12px',padding:'10px' }} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                      <Form.Label className='form-head'>Last Name</Form.Label>
                      <Form.Control type="text"  className='custom-placeholder' placeholder='sample' style={{ border: '1px solid #9F9F9F', borderRadius: '12px',padding:'10px' }} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="email" className="mb-3">
  <Form.Label className='form-head'>Email Address</Form.Label>
  <Form.Control     className='custom-placeholder' type="text" placeholder="Sample@gmail.com" style={{ border: '1px solid #9F9F9F', borderRadius: '12px',padding:'10px' }} />
</Form.Group>  
<Form.Group controlId="location" className="mb-3">
  <Form.Label className='form-head'>Location</Form.Label>
  <Form.Control     className='custom-placeholder' type="text" placeholder="Location: 789 Maple Avenue, Los Angeles, CA, 90001" style={{ border: '1px solid #9F9F9F', borderRadius: '12px',padding:'10px' }} />
</Form.Group>


<Form.Group controlId="gender" className="mb-3">
  <Form.Label className="form-head">Gender</Form.Label>
  <div style={{display:'flex'}}>
    <Form.Check
      inline
      label="Male"
      name="gender"
      type="radio"
      value="male"
      id="gender-male"
      className="custom-bootstrap-radio"
    />
    <Form.Check
      inline
      label="Female"
      name="gender"
      type="radio"
      value="female"
      id="gender-female"
      className="custom-bootstrap-radio"
    />
    <Form.Check
      inline
      label="Other"
      name="gender"
      type="radio"
      value="other"
      id="gender-other"
      className="custom-bootstrap-radio"
    />
  </div>
</Form.Group>







<Form className="address-form">
  
  
  <div className="d-flex justify-content-center mt-4">
    <button type="button" className="form-button  ">Save Changes</button>
  </div>
</Form>

              </Form>
        </div>
    </div>
  )
}

export default Contactdetails