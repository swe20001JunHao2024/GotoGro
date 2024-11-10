import React from 'react';
import './AboutUs.css';
import NavBar from '../NavBar/Nav'
import Footer from '../Footer/Footer'

const AboutUs = () => {
  return (
    <div>
      <NavBar />
      <div className="about-container">
        <div className="about-header">
          <h1>About Us</h1>
          <p>Your Trusted Grocery Shopping Partner</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              GotoGro was founded with a simple mission: to make grocery shopping
              easier and more convenient. We know how hectic life can get, and
              that’s why we provide a seamless online shopping experience, allowing
              you to shop from the comfort of your home and have groceries delivered
              straight to your door.
            </p>
          </section>

          {/* Combined Vision and Mission Section */}
          <section className="about-section vision-mission">
            <div className="vision">
              <h2>Our Vision</h2>
              <p>
                Our vision is to become the leading online grocery platform that
                empowers consumers to access the best and freshest groceries with
                just a few clicks, improving their quality of life.
              </p>
            </div>
            <div className="mission">
              <h2>Our Mission</h2>
              <p>
                We are committed to offering a wide selection of fresh produce, pantry
                staples, household items, and more—all at competitive prices. Our goal
                is to ensure that everyone has access to quality groceries, whether you
                are shopping for a family of four or just yourself.
              </p>
            </div>
          </section>

          {/* New Section with Two Containers */}
          <section className="about-section two-container-section">
            <div className="left-container"> 
                <h3>Goto Gro Malaysia</h3>
                <h2>Visit Us</h2>
                <h1>3, Jalan SS 15/8, Ss 15, 47500 Subang Jaya, Selangor</h1>
                <h2>Call Us</h2>
                <h1>GotoGro : 03-8888 8888</h1>
                <h1>Robina : 019-999 9999</h1>
                <h2>Opening Hour</h2>
                <h1>MON to FRI : 10.00am - 10.00pm</h1>
                <h1>SAT & SUN : 09.00am - 11.00pm</h1>
            </div>
            <div className="right-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.076746659741!2d101.5886850731005!3d3.074175353612848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4c5f8bdfaba7%3A0x31aac7ab1af0abc!2sINTI%20International%20University%20%26%20Colleges!5e0!3m2!1sen!2smy!4v1715339923445!5m2!1sen!2smy" 
                width="600" 
                height="450" 
                style={{ border: '0' }} 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
          </section>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default AboutUs;
