import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import './Home.css';

const heroVideos = [
  '/images/hero-background-4.mp4',
  '/images/hero-background-5.mp4'
];

const collections = [
  {
    name: 'Printemps',
    image: '/images/collections/printemps.jpg',
    description: 'Collection légère et colorée',
    link: '/collections/printemps'
  },
  {
    name: 'Édition Limitée',
    image: '/images/collections/edition-limitee.jpg',
    description: 'Pièces uniques et exclusives',
    link: '/collections/edition-limitee'
  },
  {
    name: 'Accessoires',
    image: '/images/collections/accessoires.jpg',
    description: 'Complétez votre look',
    link: '/collections/accessoires'
  }
];

const exclusiveCollections = [
  {
    name: 'Printemps',
    image: '/images/collections/printemps.jpg',
    description: 'Collection légère et colorée',
    link: '/collections/printemps'
  },
  {
    name: 'Édition Limitée',
    image: '/images/collections/edition-limitee.jpg',
    description: 'Pièces uniques et exclusives',
    link: '/collections/edition-limitee'
  },
  {
    name: 'Accessoires',
    image: '/images/collections/accessoires.jpg',
    description: 'Complétez votre look',
    link: '/collections/accessoires'
  }
];

const Home = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => 
        (prevIndex + 1) % heroVideos.length
      );
    }, 10000); // Change video every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
        <video 
          key={heroVideos[currentVideoIndex]}
          className="hero-background-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
        
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Mode Éthique & Durable</h1>
          <p>Découvrez notre collection de vêtements éco-responsables</p>
          <Link to="/products" className="cta-button">
            Découvrir la Collection
          </Link>
        </div>
      </div>

      <section className="featured-section">
        <h2>Collections Exclusives</h2>
        <div className="featured-grid">
          {exclusiveCollections.map((collection) => (
            <div key={collection.name} className="featured-item">
              <img 
                src={collection.image} 
                alt={collection.name} 
                className="featured-image"
              />
              <div className="featured-overlay">
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <Link to={collection.link} className="featured-link">
                  Découvrir
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="values-section">
        <h2>Notre Engagement</h2>
        <div className="values-grid">
          <div 
            className="value-item"
            style={{
              backgroundImage: 'url(/images/ethique.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '300px',
            }}
          >
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <h3>Éthique</h3>
              <p>Production responsable et conditions de travail équitables</p>
            </div>
          </div>
          <div 
            className="value-item"
            style={{
              backgroundImage: 'url(/images/durable.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '300px',
            }}
          >
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <h3>Durable</h3>
              <p>Matériaux écologiques et processus de fabrication durables</p>
            </div>
          </div>
          <div 
            className="value-item"
            style={{
              backgroundImage: 'url(/images/luxe.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '300px',
            }}
          >
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <h3>Luxe</h3>
              <p>Qualité exceptionnelle et design intemporel</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
