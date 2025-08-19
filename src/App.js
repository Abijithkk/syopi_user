import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import SingleProduct from "./Pages/SingleProduct";
import Wishlist from "./Pages/Wishlist";
import Category from "./Pages/Category";
import Cart from "./Pages/Cart";
import Contact from "./Pages/Contact";
import Address from "./Pages/Address";
import Cod from "./Pages/Cod";
import Refer from "./Pages/Refer";
import Subscribe from "./Pages/Subscribe";
import Orders from "./Pages/Orders";
import Contactdetails from "./Pages/Contactdetails";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Forget from "./Pages/Forget";
import { SearchProvider } from "./components/SearchContext";
import Allproducts from "./components/Allproducts";
import Layout from "./components/Layout";
import ReturnRefundPolicy from "./Pages/Return";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import DeleteAccountPolicy from "./Pages/DeleteAccountPolicy";
import OrderSuccess from "./Pages/OrderSuccess";
import SingleOrder from "./Pages/SingleOrder";
import Profile from "./Pages/Profile";
import Earn from "./Pages/Earn";
import Notification from "./Pages/Notification";
// import AddressCard from "./components/AddressCard";
import ManageAddress from "./Pages/ManageAddress";
import Privacypol from "./Pages/Privacypol";
import RefferContent from "./components/RefferContent";
import BecomeSeller from "./Pages/BecomeSeller";
function App() {
  return (
    <SearchProvider>
      <div className="App">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Landing />} />
            <Route
              path="/account-delete-policy"
              element={<DeleteAccountPolicy />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/referral/:id" element={<RefferContent />} />

            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/category" element={<Category />} />
            <Route path="/privacy-policy" element={<Privacypol />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/address/:id" element={<Address />} />
            <Route path="/cod/:id" element={<Cod />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/returnpolicy" element={<ReturnRefundPolicy />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/addressdetails" element={<Contactdetails />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/singleorder/:id" element={<SingleOrder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/allproducts" element={<Allproducts />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/manage-address" element={<ManageAddress />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
          </Route>
        </Routes>
      </div>
    </SearchProvider>
  );
}

export default App;


