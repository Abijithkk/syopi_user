import React from 'react'
import Home1 from '../components/Home1'
import Header from '../components/Header'
import FeaturedProduct from '../components/FeaturedProduct'
import Topsales from '../components/Topsales'
import Street from '../components/Street'
import Offer from '../components/Offer'
import Featuringbrands from '../components/Featuringbrands'
import Premium from '../components/Premium'
import Delight from '../components/Delight'
import Trending from '../components/Trending'
import Brandoffer from '../components/Brandoffer'
import Brand from '../components/Brand'
import Toppicks from '../components/Toppicks'
import Lowest from '../components/Lowest'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className='home'>
        <Header></Header>
        <Home1></Home1>
        <FeaturedProduct></FeaturedProduct>
        <Topsales></Topsales>
        <Street></Street>
        <Offer></Offer>
        <Featuringbrands></Featuringbrands>
        <Premium></Premium>
        <Delight></Delight>
        <Trending></Trending>
        <Brandoffer></Brandoffer>
        <Brand></Brand>
        <Toppicks></Toppicks>
        <Lowest></Lowest>
        <Footer></Footer>
    </div>
  )
}

export default Home