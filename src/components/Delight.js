import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Delight.css';
import { BASE_URL } from '../services/baseUrl';

const BrandSkeleton = React.memo(() => (
  <div className="delight-card skeleton-card">
    <div className="delight-card-image-container">
      <div className="skeleton-image"></div>
      <div className="delight-card-logo-container">
        <div className="skeleton-logo"></div>
      </div>
    </div>
  </div>
));

BrandSkeleton.displayName = 'BrandSkeleton';

const BrandCard = React.memo(({ brand, onBrandClick }) => {
  const handleClick = useCallback(() => {
    onBrandClick(brand._id);
  }, [brand._id, onBrandClick]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onBrandClick(brand._id);
    }
  }, [brand._id, onBrandClick]);

  // Fallback for missing images
  const imageSrc = brand.image ? `${BASE_URL}/uploads/${brand.image}` : '';
  const logoSrc = brand.logo ? `${BASE_URL}/uploads/${brand.logo}` : '';

  return (
    <div
      className="delight-card"
      onClick={handleClick}
      onKeyDown={handleKeyPress}  // Changed from onKeyPress to onKeyDown
      role="button"
      tabIndex={0}
      aria-label={`Shop ${brand.name} products`}
      style={{ cursor: 'pointer' }}
    >
      <div className="delight-card-image-container">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={`${brand.name} background`}
            className="delight-card-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="delight-card-logo-container">
          {logoSrc && (
            <img
              src={logoSrc}
              alt={`${brand.name} logo`}
              className="delight-card-logo"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
      <div className="brand-name-overlay">
        <span>{brand.name}</span>
      </div>
    </div>
  );
});

BrandCard.displayName = 'BrandCard';

function Delight({ brands, isLoading = false }) {
  const navigate = useNavigate();

  const validBrands = useMemo(() => {
    if (!brands || !Array.isArray(brands)) return [];
    
    return brands.filter(brand => 
      brand?._id && 
      brand?.name &&
      (brand?.image || brand?.logo)
    );
  }, [brands]);

  const handleBrandClick = useCallback((brandId) => {
    navigate(`/allproducts?brand=${brandId}`, {
      state: { refresh: true } 
    });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className='delight'>
        <p className='delight-heading'>Incredible Delights</p>
        <div className="delight-container">
          {Array(6).fill().map((_, index) => (
            <BrandSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (validBrands.length === 0) {
    return (
      <div className='delight'>
        <p className='delight-heading'>Incredible Delights</p>
        <div className="delight-container">
          <div className="no-brands-message">
            <p>No brands available at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='delight'>
      <p className='delight-heading'>Incredible Delights</p>
      <div className="delight-container">
        {validBrands.map((brand) => (
          <BrandCard
            key={brand._id}
            brand={brand}
            onBrandClick={handleBrandClick}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(Delight);