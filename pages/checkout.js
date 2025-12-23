import { useAtom } from "jotai";
import { cartAtom, confirmRemoveAtom } from "@/store";
import { useState } from "react";
import { calculateShippingFee } from "../utils/shippingCalculator";
export default function Checkout() {
  // 直接從 store 拿資料，不用 props！
  const [cart, setCart] = useAtom(cartAtom);
  const [, setConfirmRemove] = useAtom(confirmRemoveAtom);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  //...12/22補上 配送方式 , 付款方式 , 日期選填, 時段, 必填處理
  const [shippingMethod, setShippingMethod] = useState("HOME_COOL");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("anytime");
  const [showErrors, setShowErrors] = useState(false);

  // 計算最早能送達的日期 今天加上10天
  const getMinDeliveryDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 10);
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, "0");
    const day = String(minDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const minDeliveryDate = getMinDeliveryDate();
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

  //商品subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  //運費
  const shippingFee = calculateShippingFee(cart, shippingMethod);
  //
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    setShowErrors(true);

    // 1. 驗證：檢查購物車和表單
    if (cart.length === 0) {
      alert("購物車是空的！");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      // 不用 alert，下方會顯示錯誤
      return;
    }

    // 驗證電話格式：必須是 09 開頭的 10 碼
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      alert("電話格式錯誤！請輸入 09 開頭的 10 碼手機號碼");
      return;
    }

    // 2. 验证日期
    if (!deliveryDate) {
      alert("請選擇到貨日期！");
      return;
    }

    // 验证日期不能早于最小日期
    if (deliveryDate < minDeliveryDate) {
      alert(`到貨日期不能早於 ${minDeliveryDate}!`);
      return;
    }

    try {
      // 3. 準備要送給後端的資料
      const today = new Date();
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const orderData = {
        // 商品列表
        items: cart.map((item) => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),

        // 客户资料
        customerInfo: customerInfo,

        // 金额
        subtotal: subtotal,
        shippingFee: shippingFee,

        // 日期
        pickupDate: formatDate(today),
        deliveryDate: deliveryDate, // 用户选的日期！

        // 配送和付款
        paymentMethod: paymentMethod,
        deliveryTimeSlot: deliveryTime, // 时段
        logisticsOptions: {
          type: "HOME",
          subType: "TCAT",
          temperature: "0003",
        },
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
            {/* 訂單資訊 */}
            <div className="p-6 bg-gray-50">
              <div className="space-y-2">
                {/* 商品小计 */}
                <div className="flex justify-between text-gray-600">
                  <span>商品小計</span>
                  <span>NT$ {subtotal}</span>
                </div>

                {/* 运费 */}
                <div className="flex justify-between text-gray-600">
                  <span>運費</span>
                  <span>NT$ {shippingFee}</span>
                </div>

                {/* 分隔线 */}
                <div className="border-t pt-2"></div>

                {/* 合计 */}
                <div className="flex justify-between text-2xl font-bold">
                  <span>合計</span>
                  <span className="text-red-600">NT$ {total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 送貨及付款方式 */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">選擇送貨及付款方式</h2>

            <div className="space-y-3">
              {/* 選項 1: 黑貓-冷藏 + 綠界金流 */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="delivery"
                  value="TCAT_COLD_CREDIT"
                  checked={
                    shippingMethod === "HOME_COOL" &&
                    paymentMethod === "CREDIT_CARD"
                  }
                  onChange={() => {
                    setShippingMethod("HOME_COOL");
                    setPaymentMethod("CREDIT_CARD");
                  }}
                  className="mr-4 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    黑貓-冷藏（綠界金流）
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    線上刷卡付款 · 支援 Visa / Master / JCB
                  </div>
                  <div className="text-sm text-gray-600 mt-1">運費 NT$ 240</div>
                </div>
              </label>

              {/* 選項 2: 黑貓-冷藏 + 貨到付款 */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="delivery"
                  value="TCAT_COLD_COD"
                  checked={
                    shippingMethod === "HOME_COOL" && paymentMethod === "COD"
                  }
                  onChange={() => {
                    setShippingMethod("HOME_COOL");
                    setPaymentMethod("COD");
                  }}
                  className="mr-4 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    黑貓-冷藏（貨到付款）
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    黑貓司機收款 · 請準備現金
                  </div>
                  <div className="text-sm text-gray-600 mt-1">運費 NT$ 240</div>
                </div>
              </label>
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
            {/* 如果 showErrors 是true 還有 !customerInfo.name */}
            {showErrors && !customerInfo.name && (
              <p className="text-red-500 text-sm mt-1">收件人名稱是必須的</p>
            )}
            <input
              type="text"
              placeholder="請輸入電話 (09 開頭 10 碼)"
              className="w-full p-3 border rounded mt-4"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
              maxLength={10}
            />
            {showErrors && !customerInfo.phone && (
              <p className="text-red-500 text-sm mt-1">收件人電話是必須的</p>
            )}
            {showErrors &&
              customerInfo.phone &&
              !/^09\d{8}$/.test(customerInfo.phone) && (
                <p className="text-red-500 text-sm mt-1">
                  電話格式錯誤，請輸入 09 開頭的 10 碼手機號碼
                </p>
              )}
            <input
              type="text"
              placeholder="請輸入地址"
              className="w-full p-3 border rounded mt-4"
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
            />
            {showErrors && !customerInfo.address && (
              <p className="text-red-500 text-sm mt-1">收件人地址是必須的</p>
            )}
            {/* 到貨日期選擇 */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                選擇到貨日期 <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-2">
                ※ 需 10 天備貨時間，最快 {minDeliveryDate} 送達
              </p>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDeliveryDate}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                required
              />
            </div>

            {/* 到貨時段選擇 */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                選擇到貨時段
              </label>
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
              >
                <option value="anytime">任何時段（不指定）</option>
                <option value="before_13">13:00 以前</option>
                <option value="14_18">14:00 - 18:00</option>
              </select>
            </div>
            {/* 確認付款按鈕 */}
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white p-4 rounded-lg text-xl font-bold mt-6 hover:bg-red-700"
            >
              確認付款 NT$ {total}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
