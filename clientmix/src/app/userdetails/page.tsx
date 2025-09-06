"use client";
import React, { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import { getUserDetails } from '@/lib/api';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'sonner';

interface Product {
  productName: string;
  price: string;
  description: string;
  category: string;
  image: File | null;
}

interface ProductDto {
  id: number;
  productName: string;
  description: string;
  price: number;
  category: string;
  userName: string;
  returnedImage: string; // base64 encoded image
}

interface Errors {
  productName?: string;
  price?: string;
  description?: string;
  category?: string;
  image?: string;
}

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

interface BorrowerOrderProduct {
  id: number;
  productId: number;
  duration: number;
  startDate: string;
  endDate: string;
  productName: string;
  resservationStatus: string;
  totalPrice: number;
  reviewStatus: string;
  borrowerName: string;
}

const DashboardPage = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails>({ email: "", name: "", role: "", id: 0, addressLine1: "", city: "", state: "", postalCode: "", country: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [isBowrower, setIsBorrower] = useState(false);
  const [addItem, setAddItem] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [borrowerBookedItems, setBorrowerBookedItems] = useState(false);

  const[userdetailsupdating,setuserdetailsupdating] = useState(false);

  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [reservationitems, setreservationItems] = useState(false);

  const [bookeditemsLoading, setbookeditemsLoading] = useState(false)
  const [userProducts, setUserProducts] = useState<ProductDto[]>([]);

  const [borrowerOrderProducts, setBorrowerOrderProducts] = useState<BorrowerOrderProduct[]>([]);
  const [providerOrdersProducts, setproviderOrdersProducts] = useState<BorrowerOrderProduct[]>([]);

  // Edit Product Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [editProductForm, setEditProductForm] = useState<Product>({
    productName: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [editErrors, setEditErrors] = useState<Errors>({});
  const [editLoading, setEditLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const [products, setProducts] = useState<Product>({
    productName: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });

  // Dummy data for demonstration
  const dummyProducts: ProductDto[] = [
    {
      id: 1,
      productName: "Professional DJ Mixer",
      description: "High-quality 4-channel DJ mixer with built-in effects and crossfader. Perfect for professional gigs and events.",
      price: 2500.00,
      category: "Mixer",
      userName: "John Doe",
      returnedImage: "" // This would be base64 encoded image data
    },
    {
      id: 2,
      productName: "Studio Monitor Headphones",
      description: "Professional studio-grade headphones with crystal clear sound quality. Ideal for DJing and music production.",
      price: 800.00,
      category: "Headphones",
      userName: "John Doe",
      returnedImage: ""
    },
    {
      id: 3,
      productName: "Portable DJ Speakers",
      description: "Compact yet powerful speakers with excellent bass response. Battery powered for outdoor events.",
      price: 1200.00,
      category: "Speakers",
      userName: "John Doe",
      returnedImage: ""
    }
  ];

  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/auth/signin");
    }
  }, [isSignedIn, router]);

  //userdetails fetch
  useEffect(() => {
    const checkUserDetails = async () => {
      const token = await getToken({ template: "my-template" });
      try {
        if (!token) {
          console.warn("No token found, user may not be signed in.");
          return;
        }
        const user = await getUserDetails(token);
        setUserDetails(user);
        if (user && user.role === 'PROVIDER') {
          setIsProvider(true);
        } else if (user && user.role === 'BORROWER') {
          setIsBorrower(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Set dummy data if API fails for demo purposes
        setUserDetails({
          name: "John Doe",
          email: "john.doe@example.com",
          role: "PROVIDER",
          id: 1,
          addressLine1: "123 Main St",
          city: "Metropolis",
          state: "NY",
          postalCode: "12345",
          country: "USA",
          phoneNumber: "123-456-7890"
        });
        setIsProvider(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserDetails();
  }, [getToken]);

  const fetchUserProducts = async () => {
    setItemsLoading(true);
    try {
      const token = await getToken({ template: "my-template" });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/getads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProducts(response.data);
      setItemsLoading(false)

      // // For now, using dummy data
      // setTimeout(() => {
      //   setUserProducts(dummyProducts);
      //   setItemsLoading(false);
      // }, 1000);
    } catch (error) {
      console.error("Error fetching products:", error);
      setItemsLoading(false);
    }
  };


  // Fetch product by id
  const fetchProductById = async (productId: number) => {
    setFetchingProduct(true);
    try {
      const token = await getToken({ template: "my-template" });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/getadbyid/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const product = response.data;
      setEditingProduct(product);
      setEditProductForm({
        productName: product.productName,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: null, // Image will be handled separately
      });

      setFetchingProduct(false);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      setFetchingProduct(false);
      // For demo purposes, use dummy data if API fails
      const dummyProduct = dummyProducts.find(p => p.id === productId);
      if (dummyProduct) {
        setEditingProduct(dummyProduct);
        setEditProductForm({
          productName: dummyProduct.productName,
          price: dummyProduct.price.toString(),
          description: dummyProduct.description,
          category: dummyProduct.category,
          image: null,
        });
      }
    }
  };

  //handledit products
  const handleEditProduct = async (productId: number) => {
    setIsEditModalOpen(true);
    await fetchProductById(productId);
  };

  // Update product
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const token = await getToken({ template: "my-template" });
    const newErrors: Errors = {};

    if (!editProductForm.productName.trim())
      newErrors.productName = "Product name is required";
    if (!editProductForm.price || isNaN(Number(editProductForm.price)) || Number(editProductForm.price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!editProductForm.description.trim())
      newErrors.description = "Description is required";
    if (!editProductForm.category)
      newErrors.category = "Please select a category";

    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("productName", editProductForm.productName);
      formData.append("description", editProductForm.description);
      formData.append("price", Number(editProductForm.price).toString());
      formData.append("Category", editProductForm.category);
      if (editProductForm.image) {
        formData.append("img", editProductForm.image);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/updateproduct/${editingProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add success toast logic here
      toast.success("Product updated successfully");

      // Refresh the products list
      if (showItems) {
        fetchUserProducts();
      }

      // Close modal and reset form
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setEditProductForm({
        productName: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });

    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
      // Add error toast logic here
    } finally {
      setEditLoading(false);
      setEditErrors({});
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditProductForm({
      productName: "",
      price: "",
      description: "",
      category: "",
      image: null,
    });
    setEditErrors({});
  };

  //delete product
  const handleDeleteProduct = async (productId: number) => {
    try {
      const token = await getToken({ template: "my-template" });

      const result = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/deleteproduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        toast.success("Product deleted successfully");
        fetchUserProducts();
      }
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  //add product
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = await getToken({ template: "my-template" });
    const newErrors: Errors = {};

    if (!products.productName.trim())
      newErrors.productName = "Product name is required";
    if (!products.price || isNaN(Number(products.price)) || Number(products.price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!products.description.trim())
      newErrors.description = "Description is required";
    if (!products.category)
      newErrors.category = "Please select a category";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("productName", products.productName);
      formData.append("description", products.description);
      formData.append("price", Number(products.price).toString());
      formData.append("Category", products.category);
      if (products.image) {
        formData.append("img", products.image);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/postproduct`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add success toast logic here
      toast.success("Product added successfully");


      // Refresh the products list
      if (showItems) {
        fetchUserProducts();
      }

    } catch (error) {
      toast.error("Error adding product");
      console.error("Error adding product:", error);
      // Add error toast logic here
    } finally {
      setProducts({
        productName: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });
      setLoading(false);
      setAddItem(false);
      setErrors({});
    }
  };

  //handle borrower fetch products
  const fetchBookedProductsByBorrower = async () => {
    try {
      setbookeditemsLoading(true)
      const token = await getToken({ template: "my-template" });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/client/getproductsbyborrowid/${userDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res) setbookeditemsLoading(false)
      setBorrowerOrderProducts(res.data);
    } catch (error) {
      setbookeditemsLoading(false);
      toast.error("Error fetching booked products");
    }
  }

  //handle provider fetch orders
  const fetchOrderProductsByProvider = async () => {
    try {
      setReservationsLoading(true)
      const token = await getToken({ template: "my-template" });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/getproductsbyprovider/${userDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res) setReservationsLoading(false)
      setproviderOrdersProducts(res.data);
    } catch (error) {
      setReservationsLoading(false);
      toast.error("Error fetching booked products");
    }
  };


  const handleBookingApproval = async (productId: number, arg1: string) => {
    try {
      const token = await getToken({ template: "my-template" });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/provider/booking/${productId}/${arg1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        if (res.data === "Order Approved Succefully") { toast.success("Order Approved Succefully"); } else { toast.error("Order Rejected Succefully"); }
      }
      fetchOrderProductsByProvider();
    } catch (error) {
      toast.error("Error in updating booking status");
    }
  }

  const handleUserUpdate = async(e : any) =>{
    e.preventDefault();
    try {
      setuserdetailsupdating(true);
      const token = await getToken({ template: "my-template" });
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/updateuserdetails/${userDetails.id}`,
        {
          name:userDetails.name,
          addressLine1:userDetails.addressLine1,
          city:userDetails.city,
          state:userDetails.state,
          postalCode:userDetails.postalCode,
          country:userDetails.country,
          phoneNumber:userDetails.phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.status === 200){
        setuserdetailsupdating(false);
        toast.success("user details updated successfully");
      }
    } catch (error) {
      setuserdetailsupdating(false);
        toast.error("Error in updating details");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ">
      <div className="container mx-auto px-4 py-22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
            Profile Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your profile information and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-white dark:bg-slate-800 shadow-xl border-0">
              <div className="card-body items-center text-center p-8">
                {/* Avatar */}
                <div className="avatar mb-6">
                  <div className="w-32 h-32 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-base-100">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                      {userDetails?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {userDetails?.name || 'User Name'}
                </h2>

                <div className="badge badge-primary badge-lg mb-4 px-4 py-3">
                  {userDetails?.role || 'User'}
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6 break-all">
                  {userDetails?.email || 'user@example.com'}
                </p>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Online</span>
                </div>

                {/* Action Buttons */}

              </div>
            </div>


          </div>

          {/* Profile Information Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="card bg-white dark:bg-slate-800 shadow-xl border-0">
              <div className="card-body p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Personal Information
                  </h3>
                 {!isEditing && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails?.name || ''}
                      
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={!isEditing}
                      onChange={(e)=>{setUserDetails({...userDetails,name:e.target.value})}}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      value={userDetails?.email || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={true}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Phone no
                      </span>
                    </label>
                    <input
                      type="number"
                      value={userDetails?.phoneNumber || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={!isEditing}
                      onChange={(e)=>{setUserDetails({...userDetails,phoneNumber:e.target.value})}}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        City
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails?.city || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={!isEditing}
                      onChange={(e)=>{setUserDetails({...userDetails,city:e.target.value})}}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Postal code
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails?.postalCode || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={!isEditing}
                      placeholder="Enter your postal code"
                      onChange={(e)=>{setUserDetails({...userDetails,postalCode:e.target.value})}}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        state
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails?.state || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                      disabled={!isEditing}
                       onChange={(e)=>{setUserDetails({...userDetails,state:e.target.value})}}
                      placeholder="Enter your state"
                    />
                  </div>

                  {/* address Field */}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Address
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={userDetails?.addressLine1 || ""}
                      className={`textarea textarea-bordered w-full ${isEditing ? "textarea-primary" : "textarea-disabled"
                        }`}
                      disabled={!isEditing}
                       onChange={(e)=>{setUserDetails({...userDetails,addressLine1:e.target.value})}}
                      placeholder="Enter your address"
                    ></textarea>
                  </div>

                   <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-slate-700 dark:text-slate-300">
                        Country
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails?.country || ''}
                      className={`input input-bordered w-full ${isEditing ? 'input-primary' : 'input-disabled'
                        }`}
                     disabled={!isEditing}
                      placeholder="Enter your country"
                      onChange={(e)=>{setUserDetails({...userDetails,country:e.target.value})}}
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      className="btn btn-ghost"
                      onClick={() => { setIsEditing(false)}}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={userdetailsupdating}
                      className="btn btn-primary"
                      onClick={(e) => {
                        // Handle save logic here
                        handleUserUpdate(e) 
                        setIsEditing(false);
                      }}
                    >
                      {userdetailsupdating ? "Save Changes":"Saving changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="card bg-white dark:bg-slate-800 shadow-xl border-0">
              <div className="card-body p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                  Account Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Quick Actions */}
                  <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="card-body items-center text-center p-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{isProvider ? "My Orders" : "Payment History"} </h4>
                      <button className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (isProvider) {
                            setreservationItems(!reservationitems);
                            fetchOrderProductsByProvider();
                          } else if (isBowrower) {

                          }
                        }}
                      >{isProvider ? "Incoming Orders" : "History"}</button>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="card-body items-center text-center p-6">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{isProvider ? "My Items" : "Booked Items"}</h4>
                      <button
                        className={`btn btn-sm transition-all duration-200 ${showItems ? 'btn-error' : 'btn-accent'}`}
                        onClick={() => {
                          if (isProvider) {
                            setShowItems(!showItems);
                            fetchUserProducts();
                          } else if (isBowrower) {
                            setBorrowerBookedItems(!borrowerBookedItems);
                            fetchBookedProductsByBorrower();
                          }
                        }}
                      >
                        {showItems ? 'Hide' : 'Browse'}
                      </button>
                    </div>
                  </div>

                  {isProvider && (
                    <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                      <div className="card-body items-center text-center p-6">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Upload item</h4>
                        <button
                          className={`btn btn-sm transition-all duration-200 ${addItem ? 'btn-error' : 'btn-secondary'}`}
                          onClick={() => setAddItem(!addItem)}
                        >
                          {addItem ? 'Cancel' : 'Add'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* My Items Display Section */}
              {showItems && isProvider && (
                <div className="card-body pt-0 px-8 pb-8">
                  <div className="divider mb-6">
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">My Listed Items</span>
                  </div>

                  <div className="card bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 shadow-lg">
                    <div className="card-body p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Listed Products ({userProducts.length})
                          </h2>
                        </div>
                        <button
                          onClick={() => setShowItems(false)}
                          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {itemsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader />
                        </div>
                      ) : userProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            No items listed yet
                          </h3>
                          <p className="text-slate-500 mb-4">Start by adding your first product to rent out</p>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAddItem(true)}
                          >
                            Add Your First Item
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userProducts.map((product) => (
                            <div key={product.id} className="card bg-white dark:bg-slate-700 shadow-lg border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-200">
                              <div className="card-body p-6">
                                {/* Product Image Placeholder */}
                                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 rounded-lg flex items-center justify-center mb-4">
                                  {product.returnedImage ? (
                                    <img
                                      src={`data:image/jpeg;base64,${product.returnedImage}`}
                                      alt={product.productName}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="text-center">
                                      <svg className="w-12 h-12 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-sm text-slate-400">No image</span>
                                    </div>
                                  )}
                                </div>

                                {/* Product Info */}
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-2">
                                  {product.productName}
                                </h3>

                                <div className="badge badge-accent badge-sm mb-2">
                                  {product.category}
                                </div>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  {product.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-2xl font-bold text-primary">
                                    ₹{product.price.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-slate-500">per day</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-outline btn-sm flex-1"
                                    onClick={() => handleEditProduct(product.id)}
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Add Product Form */}
              {addItem && (
                <div className="card-body pt-0 px-8 pb-8">
                  <div className="divider mb-6">
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Add New Product</span>
                  </div>

                  <div className="card bg-gradient-to-br from-info/10 via-info/5 to-transparent border border-info/20 shadow-lg">
                    <div className="card-body p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Product Information</h2>
                        </div>
                        <button
                          onClick={() => setAddItem(false)}
                          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <form className="space-y-6" onSubmit={handleAddProduct}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Product Name */}
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                                Product Name *
                              </span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter product name"
                              className="input input-bordered input-info w-full text-base focus:input-primary"
                              value={products.productName}
                              onChange={(e) =>
                                setProducts({ ...products, productName: e.target.value })
                              }
                            />
                            {errors.productName && (
                              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                                Price *
                              </span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="input input-bordered input-info w-full pl-8 text-base focus:input-primary"
                                value={products.price}
                                onChange={(e) =>
                                  setProducts({ ...products, price: e.target.value })
                                }
                              />
                              {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                              Description *
                            </span>
                          </label>
                          <textarea
                            placeholder="Enter product description"
                            className="textarea textarea-info w-full focus:textarea-primary"
                            value={products.description}
                            onChange={(e) =>
                              setProducts({ ...products, description: e.target.value })
                            }
                          />
                          {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                          )}
                        </div>

                        {/* Category & Condition */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                                Category
                              </span>
                            </label>
                            <select
                              className="select select-info w-full focus:select-primary"
                              value={products.category}
                              onChange={(e) =>
                                setProducts({ ...products, category: e.target.value })
                              }
                            >
                              <option value="">Select a category</option>
                              <option value="Mixer">Mixer</option>
                              <option value="Headphones">DJ Headphones</option>
                              <option value="Speakers">DJ Speakers</option>
                              <option value="Lighting">DJ Lighting</option>
                              <option value="Lapmixer">DJ Laptop+mixer</option>
                            </select>
                            {errors.category && (
                              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                            )}
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                              Product Images
                            </span>

                          </label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Primary Image Upload */}
                            <div className="md:col-span-2">
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="product-image-primary"
                                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-info/30 rounded-xl cursor-pointer bg-info/5 hover:bg-info/10 transition-all duration-200 group"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                      <svg
                                        className="w-8 h-8 text-info"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                      </svg>
                                    </div>
                                    <p className="mb-2 text-base text-slate-600 dark:text-slate-300">
                                      <span className="font-semibold text-info">Click to upload primary image</span>
                                    </p>
                                    <p className="text-sm text-slate-500">or drag and drop</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG (Max 5MB each)</p>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-bordered file-input-info w-full"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      setProducts({ ...products, image: file });
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setAddItem(false)}
                            className="btn btn-ghost flex-1 sm:flex-none"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={loading}
                            type="submit"
                            className="btn btn-info flex-1 text-white hover:btn-primary"
                          >
                            <svg
                              visibility={loading ? "hidden" : "visible"}
                              className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            {loading ? "Adding.." : "Add Product"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}


              {/*borrowed items by borrower*/}
              {borrowerBookedItems && isBowrower && (
                <div className="card-body pt-0 px-8 pb-8">
                  <div className="divider mb-6">
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">My Ordered Items</span>
                  </div>

                  <div className="card bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 shadow-lg">
                    <div className="card-body p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Ordered Products ({borrowerOrderProducts.length})
                          </h2>
                        </div>
                        <button
                          onClick={() => setBorrowerBookedItems(false)}
                          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {bookeditemsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader />
                        </div>
                      ) : borrowerOrderProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            No items listed yet
                          </h3>
                          <p className="text-slate-500 mb-4">Start by ordering your first product</p>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setAddItem(true)}
                          >
                            Order Your First Item
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {borrowerOrderProducts.map((product) => (
                            <div key={product.id} className="card bg-white dark:bg-slate-700 shadow-lg border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-200">
                              <div className="card-body p-6">
                                {/* Product Image Placeholder */}


                                {/* Product Info */}
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-2">
                                  {product.productName}
                                </h3>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>Start Date:</span>{product.startDate}
                                </p>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>End Date:</span>{product.endDate}
                                </p>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>Total Amount:</span>{product.totalPrice}
                                </p>

                                <div
                                  className={`badge badge-sm mb-2 ${product.resservationStatus === "PENDING"
                                    ? "badge-warning"
                                    : product.resservationStatus === "APPROVED"
                                      ? "badge-success"
                                      : product.resservationStatus === "REJECTED"
                                        ? "badge-error"
                                        : "badge-ghost"
                                    }`}
                                >
                                  {product.resservationStatus}
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xl font-bold text-primary">
                                    <span>Duration :</span> {product.duration} <span> day</span>
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-outline btn-sm flex-1"
                                    onClick={() => router.push(`/review/${product.productId}/${product.id}`)}
                                  >

                                    Review
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-sm btn-outline"
                                    onClick={() => router.push(`/review/${product.productId}/${product.id}`)}
                                  >
                                    Payment
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* providers orders list*/}
              {reservationitems && isProvider && (
                <div className="card-body pt-0 px-8 pb-8">
                  <div className="divider mb-6">
                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Requested Services</span>
                  </div>

                  <div className="card bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 shadow-lg">
                    <div className="card-body p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Requested Products ({providerOrdersProducts.length})
                          </h2>
                        </div>
                        <button
                          onClick={() => setreservationItems(false)}
                          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {reservationsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader />
                        </div>
                      ) : providerOrdersProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            No items listed yet
                          </h3>

                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {providerOrdersProducts.map((product) => (
                            <div key={product.id} className="card bg-white dark:bg-slate-700 shadow-lg border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-200">
                              <div className="card-body p-6">
                                {/* Product Image Placeholder */}


                                {/* Product Info */}
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 line-clamp-2">
                                  {product.productName}
                                </h3>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>Start Date:</span>{product.startDate}
                                </p>

                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>End Date:</span>{product.endDate}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>Client Name: </span>{product.borrowerName}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                                  <span>Total Amount:</span>{product.totalPrice}
                                </p>
                                <div
                                  className={`badge badge-sm mb-2 ${product.resservationStatus === "PENDING"
                                    ? "badge-warning"
                                    : product.resservationStatus === "APPROVED"
                                      ? "badge-success"
                                      : product.resservationStatus === "REJECTED"
                                        ? "badge-error"
                                        : "badge-ghost"
                                    }`}
                                >
                                  {product.resservationStatus}
                                </div>


                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xl font-bold text-primary">
                                    <span>Duration :</span> {product.duration} <span> day</span>
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-success btn-sm flex-1"
                                    disabled={product.resservationStatus === "APPROVED" || product.resservationStatus === "REJECTED"}
                                    onClick={() => handleBookingApproval(product.id, "Approve")}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-error btn-sm flex-1"
                                    disabled={product.resservationStatus === "APPROVED" || product.resservationStatus === "REJECTED"}
                                    onClick={() => handleBookingApproval(product.id, "Rejected")}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>

        {/* Edit Product Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Product</h2>
                    <p className="text-slate-600 dark:text-slate-300">Update your product information</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {fetchingProduct ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader />
                      <p className="text-slate-600 dark:text-slate-300">Loading product details...</p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleUpdateProduct}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                            Product Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          className="input input-bordered w-full text-base focus:input-primary"
                          value={editProductForm.productName}
                          onChange={(e) =>
                            setEditProductForm({ ...editProductForm, productName: e.target.value })
                          }
                        />
                        {editErrors.productName && (
                          <p className="text-red-500 text-sm mt-1">{editErrors.productName}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                            Price *
                          </span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="input input-bordered  w-full pl-8 text-base focus:input-primary"
                            value={editProductForm.price}
                            onChange={(e) =>
                              setEditProductForm({ ...editProductForm, price: e.target.value })
                            }
                          />
                        </div>
                        {editErrors.price && (
                          <p className="text-red-500 text-sm mt-1">{editErrors.price}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                          Description *
                        </span>
                      </label>
                      <textarea
                        placeholder="Enter product description"
                        className="textarea  w-full focus:textarea-primary min-h-[120px]"
                        value={editProductForm.description}
                        onChange={(e) =>
                          setEditProductForm({ ...editProductForm, description: e.target.value })
                        }
                      />
                      {editErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                            Category *
                          </span>
                        </label>
                        <select
                          className="select  w-full focus:select-primary"
                          value={editProductForm.category}
                          onChange={(e) =>
                            setEditProductForm({ ...editProductForm, category: e.target.value })
                          }
                        >
                          <option value="">Select a category</option>
                          <option value="Mixer">Mixer</option>
                          <option value="Headphones">DJ Headphones</option>
                          <option value="Speakers">DJ Speakers</option>
                          <option value="Lighting">DJ Lighting</option>
                          <option value="Lapmixer">DJ Laptop+mixer</option>
                        </select>
                        {editErrors.category && (
                          <p className="text-red-500 text-sm mt-1">{editErrors.category}</p>
                        )}
                      </div>

                      {/* Current Image Display */}
                      {editingProduct?.returnedImage && (
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                              Current Image
                            </span>
                          </label>
                          <div className="w-full h-32 bg-slate-100 dark:bg-slate-600 rounded-lg overflow-hidden">
                            <img
                              src={`data:image/jpeg;base64,${editingProduct.returnedImage}`}
                              alt={editingProduct.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* New Image Upload */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-slate-700 dark:text-slate-300 text-base">
                          Update Image (Optional)
                        </span>
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="edit-product-image"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-warning/30 rounded-xl cursor-pointer bg-warning/5 hover:bg-warning/10 transition-all duration-200 group"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
                              <span className="font-semibold text-warning">Click to upload new image</span>
                            </p>
                            <p className="text-xs text-slate-400">PNG, JPG, JPEG (Max 5MB)</p>
                          </div>
                          <input
                            id="edit-product-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setEditProductForm({ ...editProductForm, image: file });
                            }}
                          />
                        </label>
                      </div>
                      {editProductForm.image && (
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          New image selected: {editProductForm.image.name}
                        </div>
                      )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={handleCloseEditModal}
                        className="btn btn-ghost flex-1 sm:flex-none"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={editLoading}
                        type="submit"
                        className="btn btn-primary flex-1 text-white hover:btn-primary"
                      >
                        <svg
                          visibility={editLoading ? "hidden" : "visible"}
                          className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {editLoading ? "Updating..." : "Update Product"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;