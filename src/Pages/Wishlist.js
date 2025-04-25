import React, { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import './wishlist.css';
import { getWishlistApi } from '../services/allApi';
import { BASE_URL } from '../services/baseUrl';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [wishlistStatus, setWishlistStatus] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await getWishlistApi();
                if (response.success) {
                    setWishlist(response.data.wishlist);
                    
                    const initialStatus = response.data.wishlist.reduce((acc, item) => {
                        acc[item._id] = true;
                        return acc;
                    }, {});
                    setWishlistStatus(initialStatus);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = (id) => {
        setWishlistStatus((prev) => ({
            ...prev,
            [id]: !prev[id], 
        }));
    };

    return (
        <div>

            {loading ? (
                
               <div className="wishlist">
                 <p className="wishlist-heading">
                        My Wishlist <span className='wishlist-heading-span'>({wishlist.length} items)</span>
                    </p>
                    <div className="wishlist-card-row">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
               </div>
              
            ) : wishlist.length === 0 ? (
                <div className="no-wishlist container">
                    <div className="wishlist-icon2">
                        <i className="fa-regular fa-heart"></i>
                    </div>
                    <p className="empty-wishlist">Your wishlist is empty.</p>
                    <p className="empty-wishlist-des">
                        You don’t have any products in the wishlist yet. You will find a lot
                        of interesting products on our Shop page.
                    </p>
                    <button className='wishlist-button'>
                        <span className='wishlist-button-text'>Continue Shopping</span>
                    </button>
                </div>
            ) : (
                <div className="wishlist">
                    <p className="wishlist-heading">
                        My Wishlist <span className='wishlist-heading-span'>({wishlist.length} items)</span>
                    </p>
                    <div className="wishlist-card-row">
                        {wishlist.map((item) => (
                            <div className="wishlist-card" key={item._id}>
                                <div className="wishlist-card-image-container">
                                    <img 
                                        src={`${BASE_URL}/uploads/${item.productId.images[0]}`}
                                        alt={item.productId.name} 
                                        className="wishlist-card-image" 
                                    />
                                    <div
                                        className={`wishlist-icon ${wishlistStatus[item._id] ? 'active' : ''}`}
                                        onClick={() => toggleWishlist(item._id)}
                                    >
                                        <i className={wishlistStatus[item._id] ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                    </div>
                                </div>
                                <p className="wishlist-card-title">{item.productId.name}</p>
                                <p className="wishlist-card-description">{item.productId.productType}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const SkeletonCard = () => (
    <ContentLoader 
        speed={2}
        width={250}
        height={350}
        viewBox="0 0 250 350"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="wishlist-card"
    >
        <rect x="0" y="0" rx="12" ry="12" width="250" height="280" />
        <rect x="10" y="295" rx="4" ry="4" width="200" height="15" />
        <rect x="10" y="320" rx="4" ry="4" width="150" height="15" />
    </ContentLoader>
);

export default Wishlist;
