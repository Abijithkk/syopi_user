import React, { useContext, useEffect, useMemo, useState } from 'react';
import Home1 from '../components/Home1';
import FeaturedProduct from '../components/FeaturedProduct';
import Topsales from '../components/Topsales';
import Street from '../components/Street';
import Offer from '../components/Offer';
import Featuringbrands from '../components/Featuringbrands';
import Premium from '../components/Premium';
import Delight from '../components/Delight';
import Trending from '../components/Trending';
import Brandoffer from '../components/Brandoffer';
import Brand from '../components/Brand';
import Toppicks from '../components/Toppicks';
import Lowest from '../components/Lowest';
import Footer from '../components/Footer';
import Filter from '../components/Filter';
import { SearchContext } from '../components/SearchContext';
import Allproducts from '../components/Allproducts';
import { getUserHomePageApi } from '../services/allApi';
import BrandMarquee from '../components/BrandMarquee';
import NewArrivals from '../components/NewArrivals';

function Home() {
  const { searchQuery } = useContext(SearchContext);
  const [homeData, setHomeData] = useState({
    topSales: [],
    newArrivals: [],
    brands: [],
    featuringBrandsNow: [],
    affordableProducts: [],
    lowToHighProducts: [],
    topPicksBestPrice: [],
    ProductSliders: [],
    BrandSliders: [],
    CategorySliders: [],
    OfferSection: []
  });
  const [loading, setLoading] = useState(true);
  
  // Scroll to top on component mount and when search query changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchQuery]);

  const fetchHome = async () => {
    try {
      setLoading(true);
      const response = await getUserHomePageApi();
      console.log("Homepage data response:", response);
      
      if (response.status === 200 && response.success) {
        setHomeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  // Helper function to check if an array has data
  const hasData = (array) => {
    return Array.isArray(array) && array.length > 0;
  };

  const content = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>; // Simple loading text instead of spinner
    }
    
    return (
      <>
        {searchQuery ? (
          <Allproducts />
        ) : (
          <>
            {hasData(homeData.ProductSliders) && <Home1 productSlider={homeData.ProductSliders} />}
            <Filter />
            
            {hasData(homeData.newArrivals) && <NewArrivals products={homeData.newArrivals} />}
                    
            {hasData(homeData.topSales) && <Topsales products={homeData.topSales} />}
            {hasData(homeData.featuredProducts) && <FeaturedProduct products={homeData.featuredProducts} />}   
            {hasData(homeData.OfferSection) && <Offer offerData={homeData.OfferSection} />}
            
            <Premium />
            
            {hasData(homeData.brands) && <Delight brands={homeData.brands} />}
            
            {hasData(homeData.affordableProducts) && (
              <Trending products={homeData.affordableProducts} />
            )}
            
            <BrandMarquee />
            
            {hasData(homeData.topPicksBestPrice) && (
              <Toppicks products={homeData.topPicksBestPrice} />
            )}
            
            {hasData(homeData.lowToHighProducts) && (
              <Lowest products={homeData.lowToHighProducts} />
            )}
            
            <Footer />
          </>
        )}
      </>
    );
  }, [searchQuery, homeData, loading]);

  return <div className="home">{content}</div>;
}

export default Home;