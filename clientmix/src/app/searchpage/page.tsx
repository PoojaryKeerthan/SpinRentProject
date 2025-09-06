'use client';

import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiGrid, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

// TypeScript interfaces

interface ProductDto {
  id: number;
  productName: string;
  description: string;
  price: number;
  returnedImage?: number[];
  userId?: string;
  userName?: string;
  Category: string;
}
interface FilterOption {
  value: string;
  label: string;
}

const FurnitureProductsPage: React.FC = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Sample data with more realistic furniture products


  const categories: FilterOption[] = [
    { value: '', label: 'All Categories' },
    { value: 'Mixer', label: 'Mixer' },
    { value: 'Headphones', label: 'Headphones' },
    { value: 'Speakers', label: 'Speakers' },
    { value: 'Lights', label: 'Lights' },
  ];

  const sortOptions: FilterOption[] = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  //fetching products from the server

  useEffect(() => {

    const fetchProducts = async (): Promise<void> => {
      try {
        const token = await getToken({ template: "my-template" });
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/public/getads`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ProductDto[] = await response.data;
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
        // Fallback mock data matching the image
        setProducts([
          {
            id: 1,
            productName: "Pioneer DDJ-1000 Controller",
            description: "Professional 4-channel DJ controller with jog wheels and performance pads.",
            price: 1200.00,
            Category: "Controllers",
            returnedImage: undefined
          },
          {
            id: 2,
            productName: "Numark Mixtrack Pro FX",
            description: "Beginner-friendly DJ controller with built-in effects and mixer.",
            price: 350.00,
            Category: "Controllers",
            returnedImage: undefined
          },
          {
            id: 3,
            productName: "Pioneer CDJ-3000",
            description: "Flagship professional multiplayer with touchscreen and high-quality sound.",
            price: 2400.00,
            Category: "CDJs",
            returnedImage: undefined
          },
          {
            id: 4,
            productName: "Allen & Heath Xone:96 Mixer",
            description: "High-end professional DJ mixer with 6 channels and warm analog sound.",
            price: 1700.00,
            Category: "Mixers",
            returnedImage: undefined
          },
          {
            id: 5,
            productName: "Pioneer DJM-900NXS2 Mixer",
            description: "Industry-standard DJ mixer with 4 channels and pro effects.",
            price: 2100.00,
            Category: "Mixers",
            returnedImage: undefined
          },
          {
            id: 6,
            productName: "Shure SM58 Microphone",
            description: "Legendary dynamic vocal microphone for live performances.",
            price: 110.00,
            Category: "Microphones",
            returnedImage: undefined
          },
          {
            id: 7,
            productName: "KRK Rokit 8 Studio Monitor",
            description: "High-quality powered studio monitor for accurate sound.",
            price: 250.00,
            Category: "Speakers",
            returnedImage: undefined
          },
          {
            id: 8,
            productName: "Pioneer HDJ-X10 Headphones",
            description: "Professional DJ headphones with excellent sound isolation.",
            price: 350.00,
            Category: "Headphones",
            returnedImage: undefined
          },
          {
            id: 9,
            productName: "Fog Machine FX-2000",
            description: "Stage fog machine to add atmosphere to events.",
            price: 180.00,
            Category: "Event Gear",
            returnedImage: undefined
          },
          {
            id: 10,
            productName: "Laser Light Show Projector",
            description: "RGB laser lighting system for clubs and parties.",
            price: 500.00,
            Category: "Lighting",
            returnedImage: undefined
          }
        ]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.Category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return a.productName.localeCompare(b.productName);
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const ProductCard: React.FC<{ product: ProductDto }> = ({ product }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={`data:image/jpeg;base64,${product.returnedImage}` || ''}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}


        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-orange-400 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
            onClick={() => {
              router.push(`/bookpage/${product.id}`)
            }}
          >
            <FiShoppingCart className="w-4 h-4" />
            Quick Book
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {product.Category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm leading-5 min-h-[2.5rem]">
          {product.productName}
        </h3>

        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
          by {product.userName}
        </p>

        {/* Rating */}


        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.price && product.price > product.price && (
              <span className="text-sm text-gray-400 line-through">
               ₹{product.price}
              </span>
            )}
          </div>
          <button className="bg-blue-50 hover:bg-blue-100 text-orange-600 p-2 rounded-lg transition-colors duration-200"
           onClick={() => {
              router.push(`/bookpage/${product.id}`)
            }}
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 mt-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
              Our Products
            </h1>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full max-w-md mx-auto sm:mx-0">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search gadget..."
                  className="w-full pl-12 pr-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none focus:border-transparent transition-all duration-200 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Desktop Controls */}
              <div className="hidden sm:flex items-center gap-4">
                <select
                  className="border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-1 text-black focus:ring-orange-500 focus:outline-none focus:border-transparent min-w-[140px]"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className='text-black border-none'>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-1 text-black focus:ring-orange-500 focus:outline-none focus:border-transparent min-w-[140px]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Button */}
              <button
                className="sm:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl font-medium"
                onClick={() => setShowMobileFilters(true)}
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <FiGrid className="w-4 h-4" />
            Grid View
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200">
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    className="w-92 border border-gray-300 rounded-xl px-2 py-3 bg-white text-black/80 focus:ring-1 focus:ring-orange-500 focus:outline-none focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    className="w-92 border border-gray-300 rounded-xl px-2 py-3 bg-white text-black/80 focus:ring-1 focus:ring-orange-500 focus:outline-none focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl font-medium"
                  onClick={() => {
                    setSelectedCategory('');
                    setSortBy('name');
                  }}
                >
                  Clear All
                </button>
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureProductsPage;