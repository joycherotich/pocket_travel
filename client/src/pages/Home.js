import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import TopBar from "../components/organisms/TopBar";
import Header from "../components/organisms/Header";
import heroImage from "../assets/lik.jpg";

export default function Home() {
  return (
    <div className="w-auto overflow-x-hidden m-0 p-0 bg-white text-gray-900 font-[Poppins]">
      {/* ======= TOPBAR + HEADER ======= */}
      <TopBar />
      <Header />

      {/* ======= HERO SECTION ======= */}
      <section
  className="relative h-screen w-full bg-cover bg-center flex items-center justify-start"
  style={{
    backgroundImage: `url(${heroImage})`, // ✅ Use imported image
    backgroundAttachment: "fixed",
  }}
>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/70"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 px-8 md:px-24 max-w-3xl text-white"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-2xl">
            Explore the Roars
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-yellow-400 mt-3 drop-shadow-lg">
            of the East African Safaris
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
            Journey through untamed wilderness, golden savannahs, and timeless
            landscapes. Experience the thrill of adventure with expert local
            guides and unmatched luxury.
          </p>

          {/* <button className="mt-10 bg-yellow-600 hover:bg-yellow-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-2xl transition-transform hover:scale-105">
            Request a Quote
          </button> */}
        </motion.div>

        {/* Floating Chat Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 right-8 z-20"
        >
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110">
            <MessageCircle size={28} />
          </button>
        </motion.div>
      </section>

      {/* ======= DISCOVER SECTION ======= */}
      <section className="py-24 px-6 md:px-24 bg-gradient-to-b from-white to-yellow-50 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8"
        >
          Discover the Heart of Africa
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed"
        >
          From the majestic Serengeti to the breathtaking Masai Mara, our
          curated safaris immerse you deep into the wild — where adventure meets
          serenity and every sunset tells a story of wonder.
        </motion.p>
      </section>

      {/* ======= FEATURED TOURS ======= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Featured Safari Experiences
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                title: "Masai Mara Adventure",
                img: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&w=1000&q=80",
              },
              {
                title: "Serengeti Sunset",
                img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
              },
              {
                title: "Ngorongoro Discovery",
                img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1000&q=80",
              },
            ].map((tour, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-2xl overflow-hidden shadow-lg bg-gray-50 group"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={tour.img}
                    alt={tour.title}
                    className="h-64 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {tour.title}
                  </h4>
                  <p className="text-gray-600">
                    Experience the wonders of {tour.title} with our professional
                    guides and luxury safari camps.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="bg-yellow-700 text-white py-2 text-center">
        <p className="text-lg font-medium tracking-wide">
          © {new Date().getFullYear()}Pocket of Paradise. All rights
          reserved.
        </p>
    
      </footer>
    </div>
  );
}
