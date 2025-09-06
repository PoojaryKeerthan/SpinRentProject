
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Image from "next/image";
import About from "@/components/About";
import Search from "@/components/Search";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <Hero/>
      <About/>
      <Search/>
    </div>
  );
}
