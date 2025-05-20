import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
 import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Landing() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toyxona, setToyxona] = useState([]);
  const [venueError, setVenueError] = useState(null);

  // Loading effect on page mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handling for "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Aziza va Bobur",
      image: "/testimonials/couple1.jpg",
      quote: "WeddingVenue orqali to'yimizni tashkil etdik, hamma narsa ajoyib o'tdi!",
      rating: 5,
    },
    {
      name: "Malika va Jamshid",
      image: "/testimonials/couple2.jpg",
      quote: "Platformadagi barcha xizmatlar yuqori darajada, to'yxonadan to'y kunigacha mamnunmiz.",
      rating: 5,
    },
    {
      name: "Nargiza va Temur",
      image: "/testimonials/couple3.jpg",
      quote: "Vaqtimizni tejab, eng zo'r to'yxonani tanladik. Mehmonlar hali ham to'y haqida gaplashishadi!",
      rating: 4,
    },
  ];

  // Services data
  const services = [
    {
      icon: "🎉",
      title: "To'y Marosimlari",
      desc: "Zamonaviy, klassik va milliy uslubdagi to'yxonalar.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "🍽️",
      title: "Taomlar va Servis",
      desc: "Yuqori sifatli taomlar, servis va xizmat ko'rsatish.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: "🎶",
      title: "Shou Dasturlar",
      desc: "DJ, jonli musiqa, raqs va boshqa shou elementlari.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: "📸",
      title: "Foto va Video",
      desc: "Professional suratga olish va video tasvirga olish xizmatlari.",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: "🚗",
      title: "Transport Xizmatlari",
      desc: "To'y mashinalaridan tortib mehmonlar uchun transport xizmatlari.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: "💐",
      title: "Bezak va Dizayn",
      desc: "Har qanday did va uslubdagi to'y bezaklari va dekoratsiyalar.",
      color: "from-amber-400 to-yellow-600",
    },
  ];

  // Stats data
  const stats = [
    { value: "100+", label: "To'yxonalar" },
    { value: "5000+", label: "Muvaffaqiyatli to'ylar" },
    { value: "50+", label: "Hamkor tashkilotlar" },
    { value: "4.9", label: "O'rtacha reyting (5 dan)" },
  ];

  // Steps data
  const steps = [
    {
      number: "01",
      title: "To'yxona Tanlash",
      description: "Qulay interfeysda ko'plab to'yxonalar orasidan eng ma'qulini tanlang.",
    },
    {
      number: "02",
      title: "Band Qilish",
      description: "Tanlagan to'yxonangizni sana va vaqtini belgilab onlayn band qiling.",
    },
    {
      number: "03",
      title: "Xizmatlarni Sozlash",
      description: "Taomlar, bezaklar va qo'shimcha xizmatlarni o'zingizga moslab tanlang.",
    },
    {
      number: "04",
      title: "To'y Kuni",
      description: "Hech qanday tashvishsiz, mukammal to'y kunidan zavqlaning.",
    },
  ];

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 z-50 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], rotateZ: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl"
            >
              💍
            </motion.div>
            <motion.h2
              className="text-white text-xl ml-4 font-medium"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              WeddingVenue...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

     

      <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-16 overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#2e82ff] to-[#1c4ed8] text-white pt-24 pb-32 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.6257413380501518" fill="#fff" />
              </pattern>
              <rect x="0" y="0" width="100" height="100" fill="url(#pattern-circles)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium uppercase tracking-wider">
                #1 To'y platformasi O'zbekistonda
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-bold mb-6 leading-tight"
            >
              Siz orzu qilgan to'y, <br className="hidden sm:block" />
              <span className="text-yellow-300">bizda ro'yobga chiqadi!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl max-w-3xl mx-auto mb-10"
            >
              WeddingVenue — to'yxona tanlash, buyurtma qilish va xizmatlardan samarali foydalanishning zamonaviy usuli.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/venue"
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-3 rounded-full transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                To'yxonalarni ko'rish
              </Link>
              <Link
                to="#"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-3 rounded-full transition"
              >
                Xizmatlar bilan tanishish
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl"
          >
            
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="pt-32 pb-16 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        

        {/* Services Section */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium uppercase tracking-wider mb-3"
            >
              O'z tanlashingizga qarab
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
            >
              Bizning <span className="text-[#2e82ff]">Xizmatlarimiz</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              To'yingizni mukammal qilish uchun zarur bo'lgan barcha xizmatlarni bir joydan toping.
            </motion.p>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition"
              >
                <div className={`bg-gradient-to-r ${item.color} h-2 w-full transform origin-left transition-all duration-300 group-hover:h-3`} />
                <div className="p-6">
                  <div className="text-4xl mb-4 transform transition group-hover:scale-110">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#2e82ff] transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/services/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-[#2e82ff] font-medium flex items-center group-hover:translate-x-2 transition-transform"
                    >
                      Batafsil
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/services"
              className="inline-block bg-[#2e82ff] text-white py-3 px-8 rounded-full hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              Barcha xizmatlarni ko'rish
            </Link>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium uppercase tracking-wider mb-3"
              >
                To'y rejasi
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
              >
                Qanday <span className="text-[#2e82ff]">ishlaydi</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                To'rt oddiy qadamda to'yingizni rejalashtiring va mukammal to'y marosimiga ega bo'ling.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md p-6 relative"
                >
                  <div className="absolute -top-4 left-6 bg-[#2e82ff] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium uppercase tracking-wider mb-3"
              >
                Afzalliklar
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
              >
                Nega <span className="text-[#2e82ff]">aynan biz?</span>
              </motion.h2>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
              {[
                {
                  icon: "⚡️",
                  title: "Tezkor va oson band qilish",
                  desc: "Bir necha daqiqada to'yxonani tanlang va band qiling.",
                },
                {
                  icon: "🛡️",
                  title: "Sifatli xizmatlar kafolati",
                  desc: "Eng sifatli to'yxonalar bilan hamkorlik qilamiz.",
                },
                {
                  icon: "💰",
                  title: "To'liq narxlar va tafsilotlar",
                  desc: "Hech qanday yashirin to'lovlar yo'q.",
                },
                {
                  icon: "📱",
                  title: "Mobil va web ilova orqali boshqaruv",
                  desc: "To'y tashkilotchiligini istalgan qurilmadan boshqaring.",
                },
                {
                  icon: "🔍",
                  title: "Keng tanlash imkoniyati",
                  desc: "Turli narx toifalaridagi yuzlab to'yxonalar.",
                },
                {
                  icon: "💌",
                  title: "24/7 qo'llab-quvvatlash",
                  desc: "Savollaringizga tez va aniq javob olish imkoniyati.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
                >
                  <div className="text-3xl mr-4">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium uppercase tracking-wider mb-3"
              >
                Mijozlar fikrlari
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold mb-4"
              >
                Baxtli juftliklar biz haqimizda
              </motion.h2>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
                >
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 mx-auto md:mx-0">
                        <img
                          src={testimonials[activeTestimonial].image || "/placeholder-couple.jpg"}
                          alt={testimonials[activeTestimonial].name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = "/placeholder-couple.jpg")}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${i < testimonials[activeTestimonial].rating ? "text-yellow-300" : "text-white/30"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xl italic mb-4">"{testimonials[activeTestimonial].quote}"</p>
                      <h3 className="text-lg font-medium">{testimonials[activeTestimonial].name}</h3>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeTestimonial === i ? "bg-white w-8" : "bg-white/50"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-8 gap-4">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                  aria-label="Oldingi sharh"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                  aria-label="Keyingi sharh"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 800 800">
                  <defs>
                    <pattern id="ring-pattern" patternUnits="userSpaceOnUse" width="40" height="40">
                      <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#ring-pattern)" />
                </svg>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Mukammal to'y tajribasini hoziroq rejalashtiring!
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  O'zingizga va seviklingizga mos keladigan ajoyib to'y marosimini tashkil eting.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                  <Link
                    to="/contact"
                    className="text-white hover:text-blue-100 px-8 py-3 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Bog'lanish
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-[#2e82ff] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
              aria-label="Yuqoriga qaytish"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

       </main>
    </>
  );
}

export default Landing;