import { Route, Routes } from 'react-router-dom';
import './App.css';
import Landing from './Pages/Landing';
import Home from './Pages/Home';
import SingleProduct from './Pages/SingleProduct';
import Wishlist from './Pages/Wishlist';
import Category from './Pages/Category';
import Cart from './Pages/Cart';
import Contact from './Pages/Contact';
import Address from './Pages/Address';
import Cod from './Pages/Cod'
import Refer from './Pages/Refer';
import Subscribe from './Pages/Subscribe';
import Orders from './Pages/Orders';
import Contactdetails from './Pages/Contactdetails';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import Forget from './Pages/Forget';
function App() {
  
  return (
    <div className="App">
     <Routes>
     <Route path="/login" element={<Landing />} />
     <Route path="/" element={<Home />} />
     <Route path="/product/:id" element={<SingleProduct />} />
     <Route path="/wishlist" element={<Wishlist />} />
     <Route path="/category" element={<Category />} />
     <Route path="/cart" element={<Cart />} />
     <Route path="/contact" element={<Contact />} />
     <Route path="/address" element={<Address />} />
     <Route path="/cod" element={<Cod />} />
     <Route path="/refer" element={<Refer />} />
     <Route path="/subscribe" element={<Subscribe />} />
     <Route path="/order" element={<Orders />} />
     <Route path="/addressdetails" element={<Contactdetails />} />
     <Route path="/signin" element={<Signin />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/forget" element={<Forget />} />


     </Routes>
    </div>
  );
}

export default App;
