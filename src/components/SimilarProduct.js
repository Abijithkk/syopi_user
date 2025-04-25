import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import './Similarproduct.css';
import { getSimilarProductApi } from '../services/allApi';
import { BASE_URL } from '../services/baseUrl';

function SimilarProduct() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSimilarProducts(id);
    }
  }, [id]);
  const fetchSimilarProducts = async (productId) => {
    setLoading(true); // Start loading
    try {
      const response = await getSimilarProductApi(productId);
      console.log("similar", response);
  
      if (response.status === 200 && Array.isArray(response.data.products)) { 
        setProducts(response.data.products);
      } else {
        setProducts([]); // Set an empty array if no products are found
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
    setLoading(false); // Stop loading
  };
  

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };
   const handleNavigate = useCallback(
      (id) => {
        navigate(`/product/${id}`);
        window.scrollTo(0, 0); // Scroll to the top

      },
      [navigate]
    );
  

  return (
    <div className="similar-product">
      <p className="similarproductheading">Similar Products</p>
      {loading ? (
        <div className="similar-card-row">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="similar-card-row">
          {products.map((product) => (
            <div className="similar-card" key={product._id}               onClick={() => handleNavigate(product._id)}
>
              <div className="similar-card-image-container">
                <img
                  src={`${BASE_URL}/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="similar-card-image"
                />
                <div
                  className={`wishlist-icon ${wishlist[product._id] ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product._id)}
                >
                  <i className={wishlist[product._id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </div>
              </div>
              <p className="similar-card-title">{product.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">No similar products found.</div>
      )}

      <button className="product-prev" type="button">&#10094;</button>
      <button className="product-next" type="button">&#10095;</button>
    </div>
  );
}

const SkeletonCard = () => (
  <ContentLoader
    speed={2}
    width={200}
    height={300}
    viewBox="0 0 200 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="similar-card"
  >
    <rect x="0" y="0" rx="12" ry="12" width="200" height="230" />
    <rect x="10" y="245" rx="4" ry="4" width="180" height="15" />
    <rect x="10" y="270" rx="4" ry="4" width="130" height="15" />
  </ContentLoader>
);

export default SimilarProduct;
