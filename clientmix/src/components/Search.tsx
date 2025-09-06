"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { toast } from 'sonner'
interface ProductDto {
  id: number;
  productName: string;
  description: string;
  price: number;
  returnedImage?: number[];
  userId?: string;
  userName?: string;
  category: string;
}

const Search: React.FC = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedcategory, setSelectedcategory] = useState<string>('All');
  const router = useRouter();

  const categories: string[] = ['All', 'Controllers', 'Mixer', 'Speakers', 'Headphones', 'CDJs'];

  // Fetch products from API
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
            category: "Controllers",
            returnedImage: undefined
          },
          {
            id: 2,
            productName: "Numark Mixtrack Pro FX",
            description: "Beginner-friendly DJ controller with built-in effects and mixer.",
            price: 350.00,
            category: "Controllers",
            returnedImage: undefined
          },
          {
            id: 3,
            productName: "Pioneer CDJ-3000",
            description: "Flagship professional multiplayer with touchscreen and high-quality sound.",
            price: 2400.00,
            category: "CDJs",
            returnedImage: undefined
          },
          {
            id: 4,
            productName: "Allen & Heath Xone:96 Mixer",
            description: "High-end professional DJ mixer with 6 channels and warm analog sound.",
            price: 1700.00,
            category: "Mixers",
            returnedImage: undefined
          },
          {
            id: 5,
            productName: "Pioneer DJM-900NXS2 Mixer",
            description: "Industry-standard DJ mixer with 4 channels and pro effects.",
            price: 2100.00,
            category: "Mixers",
            returnedImage: undefined
          },
          {
            id: 6,
            productName: "Shure SM58 Microphone",
            description: "Legendary dynamic vocal microphone for live performances.",
            price: 110.00,
            category: "Microphones",
            returnedImage: undefined
          },
          {
            id: 7,
            productName: "KRK Rokit 8 Studio Monitor",
            description: "High-quality powered studio monitor for accurate sound.",
            price: 250.00,
            category: "Speakers",
            returnedImage: undefined
          },
          {
            id: 8,
            productName: "Pioneer HDJ-X10 Headphones",
            description: "Professional DJ headphones with excellent sound isolation.",
            price: 350.00,
            category: "Headphones",
            returnedImage: undefined
          },
          {
            id: 9,
            productName: "Fog Machine FX-2000",
            description: "Stage fog machine to add atmosphere to events.",
            price: 180.00,
            category: "Event Gear",
            returnedImage: undefined
          },
          {
            id: 10,
            productName: "Laser Light Show Projector",
            description: "RGB laser lighting system for clubs and parties.",
            price: 500.00,
            category: "Lighting",
            returnedImage: undefined
          }
        ]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Convert byte array to base64 image URL
  // const getImageUrl = (returnedImage?: number[]): string | null => {
  //   if (returnedImage && returnedImage.length > 0) {
  //     const base64String = btoa(String.fromCharCode.apply(null, returnedImage));
  //     return `data:image/jpeg;base64,${base64String}`;
  //   }
  //   return null;
  // };

  // Filter products by category
  const filteredProducts: ProductDto[] = selectedcategory === 'All'
    ? products
    : products.filter(product => product.category === selectedcategory);

  // Navigation functions
  const goToPrevious = (): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, filteredProducts.length - 4) : prevIndex - 1
    );
  };

  const goToNext = (): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= filteredProducts.length - 4 ? 0 : prevIndex + 1
    );
  };

  // Get visible products (4 at a time)
  const getVisibleProducts = (): ProductDto[] => {
    return filteredProducts.slice(currentIndex, currentIndex + 4);
  };

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedcategory]);

  const handlecategoryChange = (category: string): void => {
    setSelectedcategory(category);
  };

  if (loading) {
    return (
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white text-black py-16 px-4'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Best Selling Product</h2>

          {/* category Filter Tabs */}
          <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handlecategoryChange(category)}
                className={`hover:text-gray-900 transition-colors pb-2 ${selectedcategory === category
                  ? 'text-gray-900 border-b-2 border-orange-500 font-medium'
                  : ''
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {filteredProducts.length > 4 && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredProducts.length - 4}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
            {getVisibleProducts().map((product) => (
              <div key={product.id} className="bg-white group cursor-pointer">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  {product.returnedImage ? (
                    <img
                      src={`data:image/jpeg;base64,${product.returnedImage}` || ''}
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-base group-hover:text-gray-700 transition-colors">
                    {product.productName}
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-orange-500 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Price and Add Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ₹ {product.price}
                    </span>
                    <button className="bg-gray-800 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors duration-200 group-hover:scale-110 transform"
                      onClick={() => {
                        router.push(`/bookpage/${product.id}`)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200 text-base cursor-pointer"
           onClick={() => router.push('/searchpage')}
          >
            View All →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Search