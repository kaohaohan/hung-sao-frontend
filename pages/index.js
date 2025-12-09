import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  "/images/hong-sao-mutton-noodles.jpg",
  "/images/hong-sao-angelica-noodles.jpg",
  "/images/branch_1.jpg",
  "/images/branch_2.jpg",
];
export default function Home() {
  // 目前顯示第幾張（從 0 開始）
  const [currentIndex, setCurrentIndex] = useState(0);

  //自動播放
  useEffect(() => {
    // 每 3 秒換下一張
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);

    // 清除 timer（避免 memory leak）
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <Head>
        <title>紅騷羊肉麵</title>
        <meta name="description" content="紅騷羊肉麵" />
      </Head>

      <div className="relative min-h-screen bg-hungsao-red overflow-hidden flex flex-col items-center justify-center text-white">
        {/* Decorative Background Pattern (CSS Gradient) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-800 via-hungsao-red to-black opacity-80 z-0"></div>

        {/* Content Container */}
        <main className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl">
          {/* Logo / Brand Mark (Top Left relative in mobile, or just top center) */}
          {/* 圖片輪播 Carousel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 w-full max-w-md"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white/20">
              {/* 圖片容器 - 用 flex 橫排，然後用 translateX 移動 */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`紅騷羊肉麵 ${index + 1}`}
                    className="w-full flex-shrink-0 aspect-[4/3] object-cover"
                  />
                ))}
              </div>

              {/* 底部小圓點 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-yellow-400 scale-125"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Title - 書法風格 */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-9xl lg:text-[10rem] mb-2 text-black drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] tracking-[0.15em]"
            style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 900 }}
          >
            紅騷
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl mb-12 text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)] tracking-[0.25em]"
            style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 700 }}
          >
            羊肉麵
          </motion.h2>

          {/* Circular Navigation Links (Simulating the bubbles in the user image) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-2xl">
            <NavBubble href="/menu" label="美味宅配" delay={0.6} />
            <NavBubble href="/menu" label="招牌菜色" delay={0.7} />
          </div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-24 mb-24"
          >
            <Link
              href="/menu"
              className="bg-hungsao-gold text-hungsao-red font-bold text-2xl md:text-3xl px-12 py-4 rounded-full shadow-lg hover:bg-yellow-400 hover:scale-105 transition transform duration-300 ring-4 ring-yellow-500/50"
              style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 700 }}
            >
              立即點餐
            </Link>
          </motion.div>
        </main>
      </div>
      {/* 門市資訊 */}
      <section className="bg-stone-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2
            className="text-4xl text-center mb-12 text-hungsao-gold"
            style={{ fontFamily: '"Noto Serif TC", serif' }}
          >
            門市資訊
          </h2>

          {/* 👇 內容放這裡 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左邊：店家資訊 */}
            <div className="space-y-6">
              {/* 地址 */}
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">地址</h3>
                  <p className="text-gray-300">台北市文山區樟新街12號</p>
                </div>
              </div>

              {/* 電話 */}
              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">電話</h3>
                  <a
                    href="tel:02-22348097"
                    className="text-gray-300 hover:text-hungsao-gold"
                  >
                    02-2234-8097
                  </a>
                </div>
              </div>

              {/* 營業時間 */}
              <div className="flex items-start gap-4">
                <span className="text-2xl">🕐</span>
                <div>
                  <h3 className="text-xl font-bold mb-1">營業時間</h3>
                  <p className="text-gray-300">
                    週一至週日 11:30-14:00 / 17:30-20:30
                  </p>
                </div>
              </div>
            </div>

            {/* 右邊：Google 地圖 */}
            <div>
              {" "}
              {/* 右邊：Google 地圖 */}
              <div className="rounded-xl overflow-hidden">
                <a
                  href="https://www.google.com/maps/place/紅騷羊肉麵"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.6081151346066!2d121.55499999999999!3d24.9794444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346801e6963b0311%3A0x6a1e54e83a31628a!2z57SF6ai3576K6IKJ6bq1!5e0!3m2!1szh-TW!2stw!4v1765274153951!5m2!1szh-TW!2stw"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="pointer-events-none"
                  />
                  <p className="text-center mt-3 text-hungsao-gold hover:underline">
                    📍 點擊查看完整地圖
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper Component for the bubbly links
function NavBubble({ href, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
    >
      <Link
        href={href}
        className="group flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-black/40 border-2 border-hungsao-gold/30 hover:bg-hungsao-gold hover:border-hungsao-gold transition-all duration-300 backdrop-blur-sm shadow-xl mx-auto"
      >
        <span
          className="text-white font-bold text-xl md:text-2xl group-hover:text-hungsao-red transition-colors duration-300 tracking-widest text-center leading-tight"
          style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 700 }}
        >
          {label.substring(0, 2)}
          <br />
          {label.substring(2)}
        </span>
      </Link>
    </motion.div>
  );
}
