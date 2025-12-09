import { useRouter } from "next/router";
//只是從 mockMenu → 換成 fetch /api/products/:id。
import { menuItems } from "@/data/mockMenu";
import { useAtom } from "jotai";
import { cartAtom, isCartOpenAtom } from "@/store";
import { useState } from "react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
/*
接收 URL 裡的商品 id
	•	從 menuItems 找對應商品
	•	顯示商品圖片
	•	顯示名稱、價格、描述
	•	顯示「加入購物車」、「立即購買」
	•	顯示商品介紹大圖（第二張圖片） */
export default function ProductDetail() {
  //拿[id]

  const router = useRouter();
  const { id } = router.query;
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);

  const product = menuItems.find((item) => item.id === id);
  // 2. 拿購物車
  const [cart, setCart] = useAtom(cartAtom);
  const [, setIsCartOpen] = useAtom(isCartOpenAtom);

  // 3. 加入購物車

  const handleAddToCart = (product, qty) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // 商品已存在，數量 +1
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      );
    } else {
      // 新商品，加入購物車
      setCart([...cart, { ...product, quantity: qty }]);
    }

    setIsCartOpen(true); // 打開購物車彈窗
  };

  const handleBuyNow = () => {
    handleAddToCart(product, qty);
    router.push("/checkout");
  };
  const handleIncrease = () => setQty(qty + 1);
  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  if (!product) return <p>商品載入中...</p>;
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左區：商品圖片 */}
          <div className="flex flex-col items-start w-full md:max-w-xl">
            {product.images && product.images.length > 0 && (
              <>
                <Swiper
                  modules={[Navigation]}
                  navigation
                  onSwiper={setMainSwiper}
                  onSlideChange={(swiper) =>
                    setActiveImageIndex(swiper.activeIndex)
                  }
                  className="w-full max-w-md rounded-lg shadow"
                >
                  {product.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {product.images.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {product.images.map((img, index) => {
                      const isActive = index === activeImageIndex;
                      return (
                        <button
                          key={index}
                          type="button"
                          aria-label={`顯示第 ${index + 1} 張圖片`}
                          onClick={() => {
                            setActiveImageIndex(index);
                            mainSwiper?.slideTo(index);
                          }}
                          className={`w-24 h-24 overflow-hidden rounded-md border-2 transition-all ${
                            isActive
                              ? "border-red-500 shadow-lg"
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`thumb-${index}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* 右區：商品資訊 */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-red-600 font-semibold mb-4">
              NT${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={handleDecrease}
                className="px-3 py-1 border rounded"
              >
                -
              </button>

              <span className="text-xl font-semibold">{qty}</span>

              <button
                onClick={handleIncrease}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={() => handleAddToCart(product, qty)}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
              >
                加入購物車
              </button>
              <button
                onClick={() => handleBuyNow()}
                className="border border-red-500 text-red-500 px-6 py-3 rounded-md hover:bg-red-100"
              >
                立即購買
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">商品介紹</h2>
        <p className="text-gray-700 mb-6">{product.description}</p>
        {product.images && product.images[1] && (
          <img
            src={product.images[1]}
            alt="detail"
            className="max-w-2xl mx-auto w-full h-auto object-contain rounded-lg shadow"
          />
        )}
      </div>
    </>
  );
}
