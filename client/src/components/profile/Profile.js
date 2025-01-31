import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/auth/me', {
          headers: { 'x-auth-token': token }
        });

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du profil', err);
        setError('Impossible de charger le profil');
        setLoading(false);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div>Chargement du profil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      {user && (
        <div className="profile-details">
          <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role || 'Utilisateur'}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
