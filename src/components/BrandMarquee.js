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
            // Setup full-width scrolling
            const setupMarquee = (marqueeRef, direction) => {
                if (!marqueeRef.current) return;
                
                // Clear any previous clones
                const originalContent = marqueeRef.current.innerHTML;
                
                // Calculate the number of clones needed to fill at least 200% of container width
                const containerWidth = marqueeRef.current.parentElement.offsetWidth;
                const contentWidth = marqueeRef.current.scrollWidth;
                
                // We need enough clones to fill at least 2x container width for seamless looping
                const clonesNeeded = Math.ceil((containerWidth * 2) / contentWidth) + 1;
                let clonesHTML = originalContent;
                
                for (let i = 0; i < clonesNeeded; i++) {
                    clonesHTML += originalContent;
                }
                
                marqueeRef.current.innerHTML = clonesHTML;
                
                // Calculate animation duration based on content width and desired speed
                const animationDuration = contentWidth / 50; // 50px per second for original content
                marqueeRef.current.style.setProperty('--scroll-duration', `${animationDuration}s`);
                
                // Set animation direction
                if (direction === 'right') {
                    marqueeRef.current.style.setProperty('--scroll-direction', 'reverse');
                } else {
                    marqueeRef.current.style.setProperty('--scroll-direction', 'normal');
                }
            };
            
            // Small delay to ensure DOM is fully rendered
            setTimeout(() => {
                setupMarquee(topMarqueeRef, 'left');
                setupMarquee(bottomMarqueeRef, 'right');
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