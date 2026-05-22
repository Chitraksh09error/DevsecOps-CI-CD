import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGlobe
} from "react-icons/fa";

function Profile() {
  return (
    <div className="profile-container">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 5}`} />
        ))}
      </div>
      
      <div className="container">
        <div className="card">
          <div className="hologram-ring"></div>
          
          <div className="avatar-container">
            <div className="avatar">
              <img src="/sample.png" alt="Chitraksh Chavan" className="profile-pic" />
              <div className="avatar-glow"></div>
            </div>
          </div>

          <h1 className="name">Chitraksh Chavan</h1>
          <p className="title">Full Stack Developer • Cloud Enthusiast</p>
          
          <div className="status-bar">
            <span className="status">● Online</span>
          </div>

          <div className="socials">
            <a href="https://www.linkedin.com/in/chitraksh-chavan" className="social linkedin" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/Chitraksh09error" className="social github" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" className="social instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social x" aria-label="X">
              <FaTwitter />
            </a>
            <a href="#" className="social youtube" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://ccstack-portfolio.vercel.app/" className="social portfolio" aria-label="Portfolio">
              <FaGlobe />
            </a>
          </div>
          
          <div className="scan-line"></div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
