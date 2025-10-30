import "@/styles/globals.css";
import { useAtom } from "jotai";
import { cartAtom, isCartOpenAtom, confirmRemoveAtom } from "@/store";
import Navbar from "@/components/Navbar";
import CartPopup from "@/components/CartPopup";

export default function App({ Component, pageProps }) {
  // 從 store 讀取全域狀態
  const [isCartOpen] = useAtom(isCartOpenAtom);
  const [confirmRemove, setConfirmRemove] = useAtom(confirmRemoveAtom);
  const [cart, setCart] = useAtom(cartAtom);

  // 確認刪除的邏輯
  const handleConfirmRemove = () => {
    const newCart = cart.filter((item) => item.id !== confirmRemove.id);
    setCart(newCart);
    setConfirmRemove(null);
  };

  return (
    <>
      {confirmRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">您確定要移除此商品嗎？</h2>
            <p className="text-gray-600 mb-6">{confirmRemove.name}</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setConfirmRemove(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 不用傳 props 了！ */}
      <Navbar />
      {isCartOpen && <CartPopup />}
      <Component {...pageProps} />
    </>
  );
}
