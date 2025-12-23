import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import OrderSummary from "@/components/OrderSummary";

export default function OrderDetail() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(
          `${apiUrl}/api/orders/${orderId}`
        );

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError("找不到訂單");
        }
      } catch (err) {
        setError("連線錯誤");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-500">錯誤：{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-8">
        <p>找不到訂單</p>
      </div>
    );
  }

  // 付款狀態判斷
  if (order.paymentStatus === "pending") {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">
            ⚠️ 付款未完成
          </h1>
          <p className="text-gray-700 mb-6">訂單編號：{order.orderId}</p>
          <p className="text-gray-600 mb-8">
            您的訂單已建立，但付款尚未完成。
            <br />
            請重新付款或聯絡客服。
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 从商品明细计算小计
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = order.amount - subtotal;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">訂單詳情</h1>

      {/* Header：订单摘要（可折叠）*/}
      <OrderSummary
        items={order.items}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={order.amount}
        collapsible={true}
      />

      {/* Body：4 个资讯区块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* 收货资讯 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">收貨資訊</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">收件人：</span>
              {order.customerInfo.name}
            </p>
            <p>
              <span className="font-semibold">電話：</span>
              {order.customerInfo.phone}
            </p>
            <p>
              <span className="font-semibold">地址：</span>
              {order.customerInfo.address}
            </p>
          </div>
        </div>

        {/* 顾客资讯 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">顧客資訊</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">姓名：</span>
              {order.customerInfo.name}
            </p>
            <p>
              <span className="font-semibold">電話：</span>
              {order.customerInfo.phone}
            </p>
          </div>
        </div>

        {/* 送货资讯 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">送貨資訊</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">配送方式：</span>
              黑貓冷藏宅配
            </p>
            <p>
              <span className="font-semibold">預計送達：</span>
              {new Date(order.deliveryDate).toLocaleDateString("zh-TW")}
            </p>
          </div>
        </div>

        {/* 付款资讯 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">付款資訊</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">付款狀態：</span>
              {order.paymentStatus === "paid" ? "已付款" : "未付款"}
            </p>
            <p>
              <span className="font-semibold">付款方式：</span>
              {order.paymentInfo?.PaymentType
                ? order.paymentInfo.PaymentType.includes("Credit")
                  ? "信用卡"
                  : order.paymentInfo.PaymentType.includes("ATM")
                  ? "ATM 轉帳"
                  : order.paymentInfo.PaymentType
                : order.paymentStatus === "paid"
                ? "線上刷卡"
                : "未付款"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
