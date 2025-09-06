"use client"
import Loader from '@/components/Loader';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent, use } from 'react';
import { FaUserTie, FaStar } from "react-icons/fa";
import { MdPayment } from 'react-icons/md';
import { RiCalendar2Line } from "react-icons/ri";
import { toast } from 'sonner'

interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  returnedImage?: string;
  userId: string;
  userName: string;
  category: string;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ReviewData {
  rating: number;
  comment: string;
}

const ReviewPage: React.FC = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { id } = useParams<{ id: string }>();
  const { orderid } = useParams<{ orderid: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const[orderLoading,setOrderLoading]=useState<boolean>(false);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    comment: ''
  });

  //authentication
  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/auth/signup");
    }
  }, [isSignedIn, router]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      try {
        const token = await getToken({ template: "my-template" });
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/getadbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: Product = await response.json();
        setProduct(data);
        setTotalPrice(data.price);
        if (response) {
          const userdetails = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/userdetails/${data.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userdata: FormData = await userdetails.json();
          if(userdata)setFormData(userdata);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch product details. Please try again.");
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Calculate duration when start and end dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days

      if (dayDiff > 0) {
        setDuration(dayDiff);
      } else {
        setDuration(1);
      }
    }
  }, [startDate, endDate]);

  // Update total price when duration changes
  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * duration);
    }
  }, [duration, product]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // If end date is before start date, clear it
    if (endDate && newStartDate > endDate) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEndDate(e.target.value);
  };

  const handleReviewChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setReviewData(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };

  const handleStarClick = (rating: number): void => {
    setReviewData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmitReview = async (): Promise<void> => {
    if (reviewData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewData.comment.trim() === '') {
      toast.error("Please add a comment");
      return;
    }

    try {
      setReviewLoading(true);
      const token = await getToken({ template: "my-template" });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/client/givereview`,
        {
          bookId: orderid,
          productId: product?.id,
          rating: reviewData.rating,
          review: reviewData.comment.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Review submitted successfully!");
        setReviewData({ rating: 0, comment: '' });
      }
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error('Error submitting review:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleBookOrder = async() => {

    try {
      setOrderLoading(true);
       const token = await getToken({ template: "my-template" });
        const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/client/bookmyorder`,
        {
          startDate:startDate,
          endDate:endDate,
          duration:duration,
          totalPrice:totalPrice,
          productId:product?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.status===200){
        setOrderLoading(false);
        toast.success("Your order request has been sent to the provider. You will be notified once they accept it.");
        router.push('/userdetails');
      }
      
    } catch (error) {
      setOrderLoading(false);
      toast.error("Failed to book the order. Please try again.");
      console.log("Error in booking order:", error);
    }finally{
      setOrderLoading(false);
    }
  };

  const getMinDate = (): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinEndDate = (): string => {
    if (startDate) {
      return startDate; // End date can be same as start date (minimum 1 day rental)
    }
    return getMinDate();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-base-content/70">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-18 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="aspect-square bg-base-300">
              {product.returnedImage ? (
                <img
                  src={`data:image/jpeg;base64,${product.returnedImage}`}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                  <p>No image available</p>
                </div>
              )}
            </figure>

            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className="badge badge-primary">{product.category}</div>
                
              </div>

              <h1 className="card-title text-2xl">{product.productName}</h1>

              <p className="text-base-content/70 leading-relaxed">{product.description}</p>

              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-base-content/70">
                  <span><FaUserTie /></span>
                  <span className="text-sm">Provider: {product.userName}</span>
                </div>
                <div className="flex items-center gap-2 text-base-content/70">
                  <span>🛡️</span>
                  <span className="text-sm">Verified Provider</span>
                </div>
              </div>

              {/* Review Form Section */}
              <div className="divider"></div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Leave a Review</h3>
                
                {/* Star Rating */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rating</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`text-2xl transition-colors ${
                          star <= reviewData.rating 
                            ? 'text-orange-400 hover:text-orange-400' 
                            : 'text-gray-300 hover:text-orange-300'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-base-content/70">
                      {reviewData.rating > 0 ? `${reviewData.rating} star${reviewData.rating > 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Review about this product</span>
                  </label>
                  <div>
                  <textarea
                    value={reviewData.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your experience with this product..."
                    className="textarea h-24 resize-none outline-none focus:outline-none mt-1 mb-1"
                    maxLength={500}
                  ></textarea>
                    </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/50">
                      {reviewData.comment.length}/500 characters
                    </span>
                  </label>
                </div>

                {/* Submit Review Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewData.rating === 0 || reviewData.comment.trim() === '' || reviewLoading}
                  className="btn btn-outline btn-primary w-full"
                >
                  {reviewLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting Review...
                    </>
                  ) : (
                    <>
                      <FaStar />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Book Your Order</h2>

              {/* Pricing */}
              <div className="bg-base-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base-content/70">Price per day</span>
                  <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-base-content/60">
                  <span>Duration: {duration} day{duration > 1 ? 's' : ''}</span>
                  <span>Total: ₹{totalPrice}</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <RiCalendar2Line size={20} />
                    <span className="label-text">Start Date</span>
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <RiCalendar2Line size={20} />
                    <span className="label-text">End Date</span>
                  </label>
                  <input
                    type="date"
                    min={getMinEndDate()}
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="input input-bordered w-full"
                    required
                    disabled={!startDate}
                  />
                </div>
              </div>

              {/* Duration Display */}
              {startDate && endDate && (
                <div className="alert alert-info mb-6">
                  <div className="flex items-center gap-2">
                    <span><RiCalendar2Line size={20} /></span>
                    <span>
                      Rental period: {duration} day{duration > 1 ? 's' : ''}
                      ({new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()})
                    </span>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Contact Information of Provider</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="form-control">
                    <p className='mb-1 text-gray-300 ml-1'>Name of Provider:</p>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      disabled={formData.name ? true : false}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <p className='mb-1 text-gray-300 ml-1'>Email:</p>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      disabled={formData.email ? true : false}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <p className='mb-1 text-gray-300 ml-1'>contact:</p>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      disabled={formData.phoneNumber ? true : false}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <p className='mb-1 text-gray-300 ml-1'>City:</p>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      disabled={formData.city ? true : false}
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <p className='mb-1 text-gray-300 ml-1'>Pincode:</p>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      disabled={formData.postalCode ? true : false}
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <p className='mb-1 text-gray-300 ml-1'>Address:</p>
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={formData.addressLine1}
                    disabled={formData.addressLine1 ? true : false}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </div>

                <div className="form-control">
                  <p className='mb-1 text-gray-300 ml-1'>country:</p>
                  <input
                    name="specialInstructions"
                    placeholder="Special Instructions (Optional)"
                    value={formData.country}
                    disabled
                    onChange={handleInputChange}
                    className="input input-bordered"
                  ></input>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Desclaimer:</h3>
                <p className='text-red-500'>Your payment will be processed only after the provider accepts your request.</p>
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="label cursor-pointer">
                    <span className="label-text">💳 Card</span>
                    <input type="radio" name="payment" className="radio radio-primary" defaultChecked />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">🏦 UPI</span>
                    <input type="radio" name="payment" className="radio radio-primary" />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">💵 COD</span>
                    <input type="radio" name="payment" className="radio radio-primary" />
                  </label>
                </div> */}
              </div>

              {/* Terms and Conditions */}
              <div className="form-control mb-6">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary" required />
                  <span className="label-text">I agree to the terms and conditions</span>
                </label>
              </div>

              {/* Order Summary */}
              <div className="bg-base-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Item: {product.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration: {duration} day{duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate: ₹{product.price}/day</span>
                  </div>
                  {startDate && endDate && (
                    <div className="flex justify-between">
                      <span>Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="divider my-2"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Book Order Button */}
              <button
                onClick={handleBookOrder}
                className="btn btn-primary btn-lg w-full"
                disabled={!startDate || !endDate || !formData.name || !formData.email || !formData.phoneNumber}
              >
                <MdPayment size={20} /> {orderLoading ? "Requesting your order" : "Request Order"} - ₹{totalPrice}
              </button>
              <div className="text-center text-sm text-base-content/60 mt-4">
                Secure payment • 24/7 support •  Easy returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;