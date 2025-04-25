import React from 'react';
import './contact.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AddressCard from '../components/AddressCard';

function Contact() {
  return (
    <div>
      <Container fluid className="contact-container my-5">
        <Row className="no-gutters">
          {/* Left Column */}
          <Col xs={12} md={7} className="contact-left-column mb-4 mb-md-0">
            {/* Form Card */}
            {/* <Card className="contact-item mb-4 p-4" >
            <Card.Title className="contact-title">
                    Contact Details
                                        </Card.Title>
              <Form className='mt-3'>
                <Row>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Group controlId="firstName">
                      <Form.Label className='form-head'>First Name</Form.Label>
                      <Form.Control type="text" style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                      <Form.Label className='form-head'>Last Name</Form.Label>
                      <Form.Control type="text" style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="address" className="mb-3">
  <Form.Label className='form-head'>Address</Form.Label>
  <Form.Control     className='custom-placeholder'
 type="text" placeholder="Pincode" style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }} />
</Form.Group>

<Form.Group controlId="detailedAddress" className="mb-3">
  <Form.Control
    as="textarea"
    rows={3}
    className='custom-placeholder'

    placeholder="Address (House No, Building, Street, Area)*"
    style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }}
  />
</Form.Group>

<Form.Group controlId="locality" className="mb-3">
  <Form.Control
    type="text"
    className='custom-placeholder'
    placeholder="Locality / Town"
    style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }}
  />
</Form.Group>
<Form.Group controlId="city" className="mb-3">
  <Form.Label className="form-head">City</Form.Label>
  <Form.Select className="custom-select">
    <option value="" disabled selected>
      Select City
    </option>
    <option>City 1</option>
    <option>City 2</option>
  </Form.Select>
</Form.Group>

<Form.Group controlId="state" className="mb-3">
  <Form.Label className="form-head">State</Form.Label>
  <Form.Select className="custom-select">
    <option value="" disabled selected>
      Select State
    </option>
    <option>State 1</option>
    <option>State 2</option>
  </Form.Select>
</Form.Group>


<Form.Group controlId="phone" className="mb-3">
  <Form.Label className='form-head'>Phone</Form.Label>
  <Form.Control  type="text" style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }} />
</Form.Group>

<Form.Group controlId="email" className="mb-3">
  <Form.Label className='form-head'>Email Address</Form.Label>
  <Form.Control type="text" style={{ border: '1px solid #9F9F9F', borderRadius: '12px' }} />
</Form.Group>
<Form className="address-form">
  <Form.Group className="mb-3">
    <Form.Label className="form-head">Save Address As</Form.Label>
    <div className="d-flex  gap-2">
      <button type="button" className="form-home-button">Home</button>
      <button type="button" className="form-work-button">Work</button>
    </div>
  </Form.Group>
  
  <div className="d-flex justify-content-center mt-4">
    <button type="button" className="form-button  ">ADD ADDRESS</button>
  </div>
</Form>

              </Form>
            </Card> */}
            <AddressCard></AddressCard>
          </Col>

          {/* Right Column */}
          <Col xs={12} md={5} className="contact-right-column">
            <Card className="contact-checkout p-3 shadow">
              <Card.Body>
                <Card.Text className="mt-3">
                  <div className="d-flex justify-content-between">
                    <p className="contact-check-total">Total Items:</p>
                    <p className="text-end contact-check-total">6</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="contact-check-total">Total MRP:</p>
                    <p className="text-end contact-check-total">$149.95</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="contact-check-total">Total Discount:</p>
                    <p className="text-end points">$10.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="contact-check-total">Syopi Points:</p>
                    <p className="text-end points">$5.00</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="contact-check-total">Total Price:</p>
                    <p className="text-end contact-check-total">$134.95</p>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;
