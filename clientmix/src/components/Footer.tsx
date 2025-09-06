"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { toast } from "sonner";

export const Footer = () => {
  const [email,setemail] = useState("");

  const router = useRouter();
  return (
    <footer className="w-full bg-gray-950 text-gray-300 ">
      {/* Main Footer Content */}
      <div className="py-16 px-6 md:px-12 lg:px-20 flex items-start justify-center">
        <div className="max-w-7xl">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Brand + Description */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">
                Spin<span className="text-orange-600">Rent</span>
              </h2>
              <p className="text-base leading-7 text-gray-400 mb-8">
                Bringing your events to life with premium DJ equipment, sound
                systems, and lighting solutions. We deliver quality and
                reliability so you can focus on the party.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <MdEmail className="text-orange-600 text-lg" />
                  <span>sprinrent@gmail.com</span>
                </div>
               
                <div className="flex items-center gap-3">
                  <MdLocationOn className="text-orange-600 text-lg" />
                  <span>Mangalore Karnataka India</span>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-orange-600 mb-6">
                  Services
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>DJ Equipment Rental</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Sound System Setup</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Lighting Solutions</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Event Planning</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Technical Support</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Equipment Delivery</li>
                </ul>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="text-lg font-semibold text-orange-600 mb-6">
                  Equipment
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>DJ Controllers</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Speakers & Subwoofers</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Microphones</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>LED Lights</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Mixing Boards</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Accessories</li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-orange-600 mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>About Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>How It Works</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Pricing</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>FAQ</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Contact</li>
                  <li className="hover:text-white cursor-pointer transition-colors" onClick={()=>router.push("/searchpage")}>Blog</li>
                </ul>
              </div>
            </div>

            {/* Social + Newsletter */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-orange-600 mb-6">
                Stay Connected
              </h3>

              {/* Social Icons */}
              <div className="flex gap-4 mb-8">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map(
                  (Icon, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 p-3 rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <Icon className="text-lg" />
                    </div>
                  )
                )}
              </div>

              {/* Newsletter */}
              <h4 className="text-sm font-medium text-white mb-4">
                Subscribe to our Newsletter
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                 value={email}
                 onChange={(e)=>setemail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
                />
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                onClick={()=> {toast.success("Email has been sent thank you!!"),
                  setemail("");
                }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 order-2 md:order-1 text-center">
              © 2024 SpinRent. All rights reserved
            </p>

            {/* Bottom Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-gray-400 order-1 md:order-2">
              {["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Refund Policy"].map(
                (link, i) => (
                  <span
                    key={i}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {link}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
