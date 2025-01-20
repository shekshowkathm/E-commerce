import React, { useEffect, useState } from "react";
import "../styles/HomePage.scss";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [cart, setCart] = useState([]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProductsData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProductsData(data.products); // Assuming `products` is the key in the response
      setFilteredProducts(data.products);

      // Extract unique categories from the products data
      const uniqueCategories = [
        ...new Set(data.products.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterProducts(event.target.value, selectedPriceRange);
  };

  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
    filterProducts(selectedCategory, event.target.value);
  };

  const filterProducts = (category, priceRange) => {
    let filtered = [...productsData];

    // Filter by category
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Filter by price range
    if (priceRange === "low") {
      filtered = filtered.filter((product) => product.price < 50); // Example price range
    } else if (priceRange === "high") {
      filtered = filtered.filter((product) => product.price >= 50); // Example price range
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${product.title} added to cart!`);
  };

  const navigateCartPage = () => {
    navigate("/cart");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page-container">
      <h1 className="page-title">E-Commerce Products</h1>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedPriceRange}
          onChange={handlePriceRangeChange}
        >
          <option value="all">All Price Ranges</option>
          <option value="low">Below $50</option>
          <option value="high">Above $50</option>
        </select>

        {/* View Cart Button */}
        <button onClick={navigateCartPage}>View Cart Items</button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner">
            <img
              src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-11-849_512.gif"
              alt="loading"
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h2 className="product-name">{product.title}</h2>
              <p className="product-category">{product.category}</p>
              <p className="product-price">${product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          className={`scroll-to-top-btn ${showScrollToTop ? "show" : ""}`}
          onClick={scrollToTop}
          aria-label="Scroll to Top"
        >
          ↑
        </button>
      )}

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
