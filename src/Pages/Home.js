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
import Header2 from '../components/Header2';
import Filter from '../components/Filter';
import { SearchContext } from '../components/SearchContext';
import Allproducts from '../components/Allproducts';
import { getUserHomePageApi } from '../services/allApi';

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
  
  const fetchHome = async () => {
    try {
      setLoading(true);
      const response = await getUserHomePageApi();
      console.log('home', response);
      
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
  const content = useMemo(() => {
    if (loading) {
      return <div className="loading">Loading...</div>; 
    }

    return (
      <>
        <Header2 />
        {searchQuery ? (
          <Allproducts />
        ) : (
          <>
            <Home1 productSlider={homeData.ProductSliders}/>
            <Filter />
            <FeaturedProduct products={homeData.newArrivals} />
            <Topsales products={homeData.topSales} />
            <Street sliders={homeData.CategorySliders} />
            <Offer offerData={homeData.OfferSection} />
            <Featuringbrands brands={homeData.featuringBrandsNow} />
            <Premium sliders={homeData.ProductSliders} />
            <Delight products={homeData.affordableProducts} />
            <Trending products={homeData.affordableProducts} />
            <Brandoffer sliders={homeData.BrandSliders} />
            <Brand brands={homeData.brands} />
            <Toppicks products={homeData.topPicksBestPrice} />
            <Lowest products={homeData.lowToHighProducts} />
            <Footer />
          </>
        )}
      </>
    );
  }, [searchQuery, homeData, loading]);

  return <div className="home">{content}</div>;
}

export default Home;