import { useAtom } from "jotai";
import { cartAtom, confirmRemoveAtom } from "@/store";
import { useState } from "react";
export default function Checkout() {
  // 直接從 store 拿資料，不用 props！
  const [cart, setCart] = useAtom(cartAtom);
  const [, setConfirmRemove] = useAtom(confirmRemoveAtom);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 更新數量的邏輯（從 _app.js 移過來）
  const handleUpdateQuantity = (product, change) => {
    const item = cart.find((i) => i.id === product.id);
    const newQuantity = item.quantity + change;

    // 如果數量變成 0，顯示確認彈窗
    if (newQuantity === 0) {
      setConfirmRemove(product);
      return;
    }

    // 更新數量
    setCart(
      cart
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 移除商品的邏輯
  const handleRemoveItem = (product) => {
    setConfirmRemove(product);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    // 1. 驗證：檢查購物車和表單
    if (cart.length === 0) {
      alert("購物車是空的！");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("請填寫完整資料！");
      return;
    }

    try {
      // 2. 準備要送給後端的資料

      // 📅 計算日期：今天 + 10 天（備貨時間）
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 10);

      // 格式化成 YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const orderData = {
        // 🔄 轉換 items 格式：id → itemId
        items: cart.map((item) => ({
          itemId: item.id, // ✅ 改成 itemId
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customerInfo: customerInfo,
        pickupDate: formatDate(today), // ✅ 今天
        deliveryDate: formatDate(deliveryDate), // ✅ 今天 + 10 天
      };

      // 3. fetch 到後端 API
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // 4. 處理後端回傳的結果
      if (response.ok) {
        const html = await response.text();

        // ✅ 用 DOMParser 解析 HTML（避免 CSP 問題）
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const originalForm = doc.querySelector("form");

        if (originalForm) {
          // 創建新表單
          const form = document.createElement("form");
          form.method = originalForm.method;
          form.action = originalForm.action;

          // 複製所有 input
          const inputs = originalForm.querySelectorAll("input");
          inputs.forEach((input) => {
            const newInput = document.createElement("input");
            newInput.type = "hidden";
            newInput.name = input.name;
            newInput.value = input.value;
            form.appendChild(newInput);
          });

          // 添加到 body 並提交
          document.body.appendChild(form);
          form.submit();
        }
      } else {
        alert("訂單建立失敗：" + response.status);
      }
    } catch (error) {
      console.error("錯誤：", error);
      alert("發生錯誤：" + error.message);
    }
  };
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">購物車結帳</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">購物車是空的</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow">
            {/* 表格 */}
            <table className="w-full">
              {/* 表頭 */}
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">商品明細</th>
                  <th className="text-center p-4">單價</th>
                  <th className="text-center p-4">數量</th>
                  <th className="text-right p-4">小計</th>
                </tr>
              </thead>

              {/* 表格內容 */}
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    {/* 商品明細 */}
                    <td className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                    </td>

                    {/* 單價 */}
                    <td className="p-4 text-center">NT${item.price}</td>

                    {/* 數量（+/- 按鈕）*/}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item, 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </td>

                    {/* 小計 */}
                    <td className="p-4 text-right font-bold">
                      NT${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 總金額 */}
            <div className="p-6 bg-gray-50 flex justify-end">
              <div className="text-2xl font-bold">
                應付總額：<span className="text-red-600">NT$ {totalPrice}</span>
              </div>
            </div>
          </div>

          {/* 顧客資料表單 */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">填寫收貨資訊</h2>

            <input
              type="text"
              placeholder="請輸入姓名"
              className="w-full p-3 border rounded"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="請輸入電話"
              className="w-full p-3 border rounded mt-4"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="請輸入地址"
              className="w-full p-3 border rounded mt-4"
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
            />
            {/* 確認付款按鈕 */}
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white p-4 rounded-lg text-xl font-bold mt-6 hover:bg-red-700"
            >
              確認付款 NT$ {totalPrice}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
