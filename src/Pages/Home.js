import React, { useContext, useMemo } from 'react';
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

function Home() {
  const { searchQuery } = useContext(SearchContext);

  const content = useMemo(() => {
    return (
      <>
        <Header2 />
        {searchQuery ? (
          <Allproducts />
        ) : (
          <>
            <Home1 />
            <Filter />
            <FeaturedProduct />
            <Topsales />
            <Street />
            <Offer />
            <Featuringbrands />
            <Premium />
            <Delight />
            <Trending />
            <Brandoffer />
            <Brand />
            <Toppicks />
            <Lowest />
            <Footer />
          </>
        )}
      </>
    );
  }, [searchQuery]);

  return <div className="home">{content}</div>;
}

export default Home;
