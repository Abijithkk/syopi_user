import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addWishlistApi,
  getProductsWithSort, 
  getWishlistApi,
  removefromWishlist,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { SearchContext } from "./SearchContext";
import FilterPanel from "./FilterPanel";
import "./Allproduct.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";

function Allproducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useContext(SearchContext);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subcategoryFromUrl = queryParams.get("subcategory");

  const [price, setPrice] = useState([0, 5000]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768; 
  }
  return true; 
});
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoryFromUrl || null
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 12;
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

const parseUrlFilters = useCallback(() => {
  const params = new URLSearchParams(location.search);
  
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice || maxPrice) {
    setPrice([
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 5000
    ]);
  }
  
  const brandParam = params.get("brand");
  if (brandParam) {
    const brandsArray = brandParam.includes(",") ? 
      brandParam.split(",").map(brand => brand.trim()) : 
      [brandParam.trim()];
    setSelectedBrands(brandsArray);
  } else {
    setSelectedBrands([]);
  }
  
  const productType = params.get("productType");
  if (productType) {
    setSelectedProductType([productType]);
  }
  
  const discountMin = params.get("discountMin");
  if (discountMin) {
    setSelectedDiscount(parseInt(discountMin));
  }
  
  const newArrivals = params.get("newArrivals");
  if (newArrivals === "true") {
   
    
  }
  
  const minRating = params.get("minRating");
  if (minRating) {
    setSelectedRating(parseFloat(minRating));
  }
  
  const size = params.get("size");
  if (size) {
   
  }
}, [location.search]);

const fetchProducts = useCallback(
  async (resetProducts = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(location.search);
      
      let brandFromUrl = null;
     const urlBrandParam = params.get("brand");
      const urlBrands = urlBrandParam ? 
        urlBrandParam.split(",").map(brand => brand.trim()) : 
        null;

      const activeBrands = selectedBrands.length > 0 ? selectedBrands : urlBrands;

      const apiOptions = {
        page: resetProducts ? 1 : page,
        limit: productsPerPage,
        search: searchQuery || params.get("search") || null,
        productType: selectedProductType.length > 0 ? selectedProductType : 
                    (params.get("productType") ? [params.get("productType")] : null),
        subcategory: selectedSubcategory || params.get("subcategory") || null,
        category: params.get("category") || null,
        minPrice: price[0] > 0 ? price[0] : (params.get("minPrice") ? parseInt(params.get("minPrice")) : null),
        maxPrice: price[1] < 5000 ? price[1] : (params.get("maxPrice") ? parseInt(params.get("maxPrice")) : null),
        discountMin: selectedDiscount || (params.get("discountMin") ? parseInt(params.get("discountMin")) : null),
        
        brand: activeBrands ? activeBrands.join(",") : null,
        
        minRating: selectedRating || (params.get("minRating") ? parseFloat(params.get("minRating")) : null),
        newArrivals: params.get("newArrivals") === "true" || null,
      };

      Object.keys(apiOptions).forEach(key => {
        if (apiOptions[key] === null || 
            apiOptions[key] === undefined || 
            (Array.isArray(apiOptions[key]) && apiOptions[key].length === 0)) {
          delete apiOptions[key];
        }
      });

      
      switch (sortOption) {
        case "priceAsc":
          apiOptions.sort = "asc";
          apiOptions.sortField = "price";
          break;
        case "priceDesc":
          apiOptions.sort = "desc";
          apiOptions.sortField = "price";
          break;
        case "newest":
          apiOptions.sort = "desc";
          apiOptions.sortField = "createdAt";
          break;
        case "popularity":
        default:
          apiOptions.sort = "desc";
          apiOptions.sortField = "popularity";
          break;
      }


      const response = await getProductsWithSort(apiOptions);
      console.log(response);
      

      if (response.success) {
        const newProducts = response.data.products;
        
        setTotalProducts(response.data.total || 0);
       
        setHasMore(newProducts.length >= productsPerPage);
        setProducts(prevProducts =>
          resetProducts ? newProducts : [...prevProducts, ...newProducts]
        );

        if (resetProducts) {
          setPage(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        if (resetProducts) setProducts([]);
        setHasMore(false);
        setError(response.message || "Failed to load products");
      }
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  },
  [page, searchQuery, selectedProductType, price, selectedDiscount, sortOption, selectedSubcategory, selectedBrands, selectedRating, location.search]
);
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const brandParam = params.get("brand");
  
  if (brandParam) {
    const brandsArray = brandParam.split(",").map(brand => brand.trim());
    setSelectedBrands(brandsArray);
  }
}, [location.search]);


const handleBrandChange = (brands) => {
  const brandsArray = Array.isArray(brands) ? brands : [brands];
  const params = new URLSearchParams(location.search);
  
  if (brandsArray.length > 0) {
    params.set("brand", brandsArray.join(","));
  } else {
    params.delete("brand");
  }
  
  setSelectedBrands(brandsArray);
  setPage(1);
  navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  fetchProducts(true);
};


const fetchProductsRef = useRef();
fetchProductsRef.current = fetchProducts;
useEffect(() => {
  const params = new URLSearchParams(location.search); 
  const urlBrands = params.get("brand");
  setSelectedBrands(urlBrands ? urlBrands.split(",") : []);
  fetchProducts(true);
}, [location.search]);

useEffect(() => {
  const params = new URLSearchParams(location.search);

  const hasTimestamp = params.has("_k");
  if (hasTimestamp) {
    params.delete("_k");
    const cleanUrl = `${location.pathname}${
      params.toString() ? "?" + params.toString() : ""
    }`;
    navigate(cleanUrl, { replace: true });
    return; 
  }

  const needsRefresh = location.state?.refresh;
  if (needsRefresh) {
    navigate(location.pathname + location.search, {
      replace: true,
      state: {},
    });
  }

  parseUrlFilters();

  const newSubcategoryFromUrl = params.get("subcategory");
  setSelectedSubcategory(newSubcategoryFromUrl || null);
  setPage(1);

  fetchProductsRef.current(true);

}, [location.search, location.pathname, location.state?.refresh, navigate, parseUrlFilters]);
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessuserToken");
        if (!token) return;

        const response = await getWishlistApi();
        if (response?.data?.wishlist) {
          setWishlist(
            new Set(
              response.data.wishlist.map((item) => String(item.productId._id))
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page, fetchProducts]);

  const handleApplyFilters = () => {
    fetchProducts(true);
  };

 
const toggleWishlist = async (e, productId, productName = "Product") => {
  e.stopPropagation();

  const token = localStorage.getItem("accessuserToken");
  if (!token) {
    toast.error("Please sign in to add items to wishlist", {
      duration: 3000,
      position: "top-center",
    });
    navigate("/signin");
    return;
  }

  const isCurrentlyWishlisted = wishlist.has(String(productId));
  const loadingToastId = toast.loading(
    isCurrentlyWishlisted ? "Removing from wishlist..." : "Adding to wishlist...",
    {
      position: "top-center",
    }
  );

  try {
    let response;
    
    if (isCurrentlyWishlisted) {
      response = await removefromWishlist(productId);
    } else {
      response = await addWishlistApi(productId);
    }


    if (!response.success) {
      console.error("Failed to toggle wishlist:", response.error);
      toast.error("Failed to update wishlist. Please try again.", {
        id: loadingToastId,
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    // Update wishlist state
    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (isCurrentlyWishlisted) {
        updatedWishlist.delete(String(productId));
      } else {
        updatedWishlist.add(String(productId));
      }
      return updatedWishlist;
    });

    // Show success toast
    if (isCurrentlyWishlisted) {
      toast.success(`${productName} removed from wishlist`, {
        id: loadingToastId,
        duration: 2000,
        position: "top-center",
        icon: "💔",
      });
    } else {
      toast.success(`${productName} added to wishlist`, {
        id: loadingToastId,
        duration: 2000,
        position: "top-center",
        icon: "❤️",
      });
    }
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
    toast.error("Something went wrong. Please try again.", {
      id: loadingToastId,
      duration: 3000,
      position: "top-center",
    });
  }
};

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };
  const handleRatingChange = (rating) => {
    const params = new URLSearchParams(location.search);
    
    if (rating) {
      params.set("minRating", rating === "less-than-3" ? 1 : rating === "3-to-4" ? 3 : 4);
    } else {
      params.delete("minRating");
    }
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    setSelectedRating(rating);
    setPage(1);
    fetchProducts(true);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
    fetchProducts(true);
  };

  const displayedProducts = products;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };
  
  const clearAllFilters = () => {
    setSelectedProductType([]);
    setSelectedDiscount(null);
    setSelectedBrands([]);
    setSelectedRating(null);
    setPrice([0, 5000]);
    setSortOption("popularity");
    
    // Clear URL parameters as well
    navigate("/allproducts", { replace: true });
  };

  // Render product cards
  const renderProductCards = () => {
    if (displayedProducts.length === 0 && !loading) {
      return (
        <div className="no-results">
          <div className="no-results-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching your criteria.</p>
          <button
            className="clear-filters-btn"
            onClick={clearAllFilters}
          >
            Clear Filters
          </button>
        </div>
      );
    }

    return displayedProducts.map((product) => (
      <motion.div
        className="product-card"
        key={product._id}
        variants={productVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onClick={() => handleNavigate(product._id)}
      >
        <div className="product-img-container">
          <img
            src={`${BASE_URL}/uploads/${product.images[0]}`}
            alt={product.name}
            className="product-img"
            loading="lazy"
          />

          {product.variants &&
            product.variants[0]?.offerPrice &&
            product.variants[0]?.price && (
              <div className="discount-tag">
                {product.discountPercentage}
                % OFF
              </div>
            )}

<button
            className={`wishlist-btn ${
              wishlist.has(String(product._id)) ? "active" : ""
            }`}
            onClick={(e) => toggleWishlist(e, product._id, product.name)}
            aria-label={
              wishlist.has(String(product._id))
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <i
              className={
                wishlist.has(String(product._id))
                  ? "fas fa-heart"
                  : "far fa-heart"
              }
            ></i>
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-meta">
            <p className="product-type">{product.productType}</p>
            {product.averageRating && (
              <div className="product-rating">
                <i className="fas fa-star"></i>
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="product-price">
            {product.variants && product.variants[0]?.offerPrice ? (
              <>
                <span className="price-current">
                  ₹{product.variants[0].offerPrice}
                </span>
                <span className="price-original">
                  ₹{product.variants[0].wholesalePrice}
                </span>
              </>
            ) : product.variants && product.variants[0]?.price ? (
              <span className="price-current">
                ₹{product.variants[0].price}
              </span>
            ) : (
              <span className="price-current">Price not available</span>
            )}
          </div>
        </div>
      </motion.div>
    ));
  };

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(8)
      .fill()
      .map((_, index) => (
        <div className="product-card skeleton" key={`skeleton-${index}`}>
          <div className="product-img-container">
            <Skeleton height={250} />
          </div>
          <div className="product-info">
            <Skeleton height={24} width="80%" />
            <Skeleton height={18} width="50%" />
            <Skeleton height={22} width="60%" />
          </div>
        </div>
      ));
  };

  return (
    <div className="products-page">
      <div
        className={`products-container ${isFilterOpen ? "filter-open" : ""}`}
      >
      <FilterPanel
  onApplyFilters={handleApplyFilters}
  price={price}
  setPrice={setPrice}
  selectedProductType={selectedProductType}
  setSelectedProductType={setSelectedProductType}
  selectedDiscount={selectedDiscount}
  setSelectedDiscount={setSelectedDiscount}
  selectedBrands={selectedBrands}
  setSelectedBrands={handleBrandChange}
  selectedRating={selectedRating}
 setSelectedRating={handleRatingChange}
  isFilterOpen={isFilterOpen}
  setIsFilterOpen={setIsFilterOpen}
/>

        <main className="products-main">
          <div className="products-sort-bar">
            <div className="filter-toggle-container">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="filter-toggle-btn"
                aria-label={isFilterOpen ? "Close filters" : "Open filters"}
              >
                <i
                  className={`fas fa-${isFilterOpen ? "times" : "filter"}`}
                ></i>
                <span>{isFilterOpen ? "Close Filters" : "Filters"}</span>
              </button>
            </div>

            <div className="products-count">
              {!loading && <span>{totalProducts} Products</span>}
            </div>

            <div className="sort-control">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="popularity">Popularity</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          <motion.div
            className="products-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading && page === 1 ? renderSkeletons() : renderProductCards()}

            {loading && page > 1 && (
              <div className="loading-more">
                <div className="spinner"></div>
                <p>Loading more products...</p>
              </div>
            )}

            {!loading && hasMore && (
              <div ref={ref} className="load-more-trigger"></div>
            )}
          </motion.div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button
                onClick={() => fetchProducts(true)}
                className="retry-button"
              >
                <i className="fas fa-redo"></i> Try Again
              </button>
            </div>
          )}

          {!loading && displayedProducts.length > 0 && !hasMore && (
            <div className="no-more-products">
              <p>You've seen all products</p>
            </div>
            )}
        </main>
      </div>

    </div>
  );
}

export default Allproducts;