import React from 'react'
import './Services.css'
import freeDeli from '../assets/free-delivery.png'
import organic from '../assets/organic.png'
import paypal from '../assets/Paypal.png'
import customerService from '../assets/customer-service.png'

const Services = () => {
  return (
    <div className='service-section'>
      <div className='service-card'>
        <div className='inner-service-card'>
          <img src={freeDeli} alt='Free Delivery' />
          <h3>Free Delivery</h3>
          <p>We offer free delivery on all orders over RM50.</p>
        </div>

        <div className='inner-service-card'>
          <img src={organic} alt='Organic Products' />
          <h3>Organic Products</h3>
          <p>All our products are sourced from organic farms.</p>
        </div>

        <div className='inner-service-card'>
          <img src={paypal} alt='PayPal Secure Payments' />
          <h3>Secure Payments</h3>
          <p>We accept PayPal and offer secure online transactions.</p>
        </div>

        <div className='inner-service-card'>
          <img src={customerService} alt='24/7 Customer Service' />
          <h3>24/7 Customer Service</h3>
          <p>Our team is available around the clock to assist you.</p>
        </div>
      </div>
    </div>
  )
}

export default Services
