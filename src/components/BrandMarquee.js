import React, { useEffect, useState, useRef } from 'react';
import { getBrandApi } from '../services/allApi';
import './brandmarquee.css';
import { BASE_IMG_URL } from '../services/baseUrl';

function BrandMarquee() {
    const [brands, setBrands] = useState([]);
    const topMarqueeRef = useRef(null);
    const bottomMarqueeRef = useRef(null);
    
    useEffect(() => {
        const fetchBrands = async() => {
            try {
                const response = await getBrandApi();
                if(response.status === 200 && response.success){
                    setBrands(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBrands();
    }, []);
    
    useEffect(() => {
        if (brands.length > 0) {
            // Setup marquee content duplication for seamless looping
            const setupMarquee = (marqueeRef) => {
                if (!marqueeRef.current) return;
                
                // Clear any previous clones
                const originalContent = marqueeRef.current.innerHTML;
                
                // Duplicate content for seamless looping
                marqueeRef.current.innerHTML = originalContent + originalContent;
            };
            
            // Small delay to ensure DOM is fully rendered
            setTimeout(() => {
                setupMarquee(topMarqueeRef);
                setupMarquee(bottomMarqueeRef);
            }, 100);
        }
    }, [brands]);
    
    if (brands.length === 0) return null;

    return (
        <div className="brand-marquee-container">
            
            {/* Top marquee with logos scrolling left */}
            <div className="marquee-wrapper">
                <div ref={topMarqueeRef} className="marquee marquee-left">
                    {brands.map((brand) => (
                        <div key={`logo-${brand._id}`} className="marquee-item">
                            <img 
                                src={`${BASE_IMG_URL}/uploads/${brand.logo}`} 
                                alt={brand.name} 
                                className="brand-logo"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/120x60?text=Brand+Logo'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Bottom marquee with names scrolling right */}
            <div className="marquee-wrapper">
                <div ref={bottomMarqueeRef} className="marquee marquee-right">
                    {brands.map((brand) => (
                        <div key={`name-${brand._id}`} className="marquee-item">
                            <span className="brand-name">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BrandMarquee;