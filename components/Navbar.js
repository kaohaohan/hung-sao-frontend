import Link from "next/link";
import Image from "next/image";
import { useAtom } from "jotai";
import { cartAtom, isCartOpenAtom } from "@/store";

export default function Navbar() {
  // 直接從 store 拿資料，不用 props！
  const [cart] = useAtom(cartAtom);
  const [, setIsCartOpen] = useAtom(isCartOpenAtom);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // 1. 背景改用我們定義的 "hungsao-red"
    <nav className="bg-hungsao-red text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo + 店名 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <Image
              src="/red-logo.png"
              alt="紅騷羊肉麵"
              width={50}
              height={50}
              className="object-contain bg-white rounded-full p-1"
            />
            {/* 2. 加上店名，使用 Noto Serif TC */}
            <span 
              className="text-2xl tracking-widest"
              style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 700 }}
            >
              紅騷羊肉麵
            </span>
          </Link>

          {/* 右側：購物車 */}
          <div className="flex items-center gap-6">
            {/* 購物車按鈕 */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-red-800 p-2 rounded-lg transition"
            >
              {/* 購物車 SVG */}
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>

              {/* 3. 數量徽章改用 "hungsao-gold" 配 "hungsao-red" */}
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-hungsao-gold text-hungsao-red text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-hungsao-red">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
