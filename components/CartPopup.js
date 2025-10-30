import React from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { cartAtom, isCartOpenAtom } from "@/store";

export default function CartPopup() {
  const router = useRouter();

  // 直接從 store 拿資料，不用 props！
  const [cart] = useAtom(cartAtom);
  const [, setIsCartOpen] = useAtom(isCartOpenAtom);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed top-16 right-4 z-50 w-96 bg-white rounded-lg shadow-2xl border">
      <div className="p-4">
        {/* 標題和關閉按鈕 */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">我的購物車</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-2xl">
            ×
          </button>
        </div>

        {/* 商品列表 */}
        <div className="max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500">購物車是空的</p>
          ) : (
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold">
                    ${item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 總金額和結帳 */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-3">
            <span className="font-bold">總金額：</span>
            <span className="font-bold">${totalPrice}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={() => {
              router.push("/checkout");
              setIsCartOpen(false);
            }}
            className="w-full bg-green-500 text-white py-2 rounded font-bold disabled:bg-gray-300"
          >
            立即結帳
          </button>
        </div>
      </div>
    </div>
  );
}
