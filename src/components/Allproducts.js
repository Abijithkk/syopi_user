import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { ToastContainer } from "react-toastify";
import toast from "react-hot-toast";

function Allproducts() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery, searchResults } = useContext(SearchContext);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subcategoryFromUrl = queryParams.get("subcategory");

  const [price, setPrice] = useState([0, 1000]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoryFromUrl || null
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 12;
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(
    async (resetProducts = false) => {
      try {
        setLoading(true);
        setError(null);

        const apiOptions = {
          page: resetProducts ? 1 : page,
          limit: productsPerPage,
          search: searchQuery || null,
          productType: selectedProductType.length > 0 ? selectedProductType : null,
          subcategory: selectedSubcategory || null,
          minPrice: price[0] > 0 ? price[0] : null,
          maxPrice: price[1] < 1000 ? price[1] : null,
          discountMin: selectedDiscount || null,
        };

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
            apiOptions.newArrivals = true;
            break;
          case "rating":
            apiOptions.minRating = 4;
            apiOptions.sort = "desc";
            apiOptions.sortField = "averageRating";
            break;
          case "popularity":
          default:
            apiOptions.sortField = "popularity";
            apiOptions.sort = "desc";
            break;
        }

        console.log("API Options:", apiOptions);
        
        const response = await getProductsWithSort(apiOptions);
        console.log("API Response:", response);

        if (response.success) {
          const newProducts = response.data.products;
          setTotalProducts(response.data.total || 0);

          if (newProducts.length < productsPerPage) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          setProducts((prevProducts) =>
            resetProducts ? newProducts : [...prevProducts, ...newProducts]
          );

          if (resetProducts) {
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          if (resetProducts) {
            setProducts([]);
          }
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
    [
      page,
      searchQuery,
      selectedProductType,
      price,
      selectedDiscount,
      sortOption,
      selectedSubcategory,
    ]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Remove timestamp parameter if present (URL cleaning)
    const hasTimestamp = params.has("_k");
    if (hasTimestamp) {
      params.delete("_k");
      const cleanUrl = `${location.pathname}${
        params.toString() ? "?" + params.toString() : ""
      }`;
      navigate(cleanUrl, { replace: true });
    }

    // Get subcategory from URL and reset pagination
    const newSubcategoryFromUrl = params.get("subcategory");
    setSelectedSubcategory(newSubcategoryFromUrl || null);
    setPage(1);

    // Check if we need a refresh
    if (location.state && location.state.refresh) {
      navigate(location.pathname + location.search, {
        replace: true,
        state: {},
      });
      fetchProducts(true);
    }
  }, [
    location.search,
    searchQuery,
    selectedSubcategory,
    sortOption,
    location.pathname,
    location.state,
    navigate,
    fetchProducts,
  ]);

  useEffect(() => {
    fetchProducts(true);
  }, [selectedSubcategory, fetchProducts]);

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

  // When page changes, fetch more products
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page, fetchProducts]);

  const handleApplyFilters = () => {
    fetchProducts(true);
  };

  // Toggle wishlist handler
  const toggleWishlist = async (e, productId) => {
    e.stopPropagation();

    const token = localStorage.getItem("accessuserToken");
    if (!token) {
      toast.info("Please sign in to add items to your wishlist");
      navigate("/signin");
      return;
    }

    try {
      const response = await addWishlistApi(productId);

      if (response.success) {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          if (newWishlist.has(String(productId))) {
            newWishlist.delete(String(productId));
            toast.success("Removed from wishlist");
          } else {
            newWishlist.add(String(productId));
            toast.success("Added to wishlist");
          }
          return newWishlist;
        });
      } else {
        toast.error(response.message || "Failed to update wishlist");
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
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
            onClick={() => {
              setSelectedProductType([]);
              setSelectedDiscount(null);
              setPrice([0, 1000]);
              setSortOption("popularity");
              fetchProducts(true);
            }}
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
                {Math.round(
                  ((product.variants[0].price -
                    product.variants[0].offerPrice) /
                    product.variants[0].price) *
                    100
                )}
                % OFF
              </div>
            )}

          <button
            className={`wishlist-btn ${
              wishlist.has(String(product._id)) ? "active" : ""
            }`}
            onClick={(e) => toggleWishlist(e, product._id)}
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
                  ₹{product.variants[0].price}
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

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Allproducts;