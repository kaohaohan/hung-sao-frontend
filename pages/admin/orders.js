import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true); // 設flag
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // null 代表尚未選取訂單，之後點「查看」會被設成某一筆訂單物件
  const [trackingNumber, setTrackingNumber] = useState(""); // ➜ 出貨時輸入的物流單號

  //狀態日期篩選
  const [statusFilter, setStatusFilter] = useState(""); // 狀態：pending / paid / shipped
  const [startDate, setStartDate] = useState(""); // 起始日期 (YYYY-MM-DD)
  const [endDate, setEndDate] = useState(""); // 結束日期 (YYYY-MM-DD)
  // /api/admin/orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        //要做query string 要說篩選狀態 ex: 假設user 只想看paid
        const baseUrl = "http://localhost:8080/api/admin/orders";

        // 1. 開 params 收集條件
        const params = new URLSearchParams();

        // 2. 如果有選狀態就加上去
        if (statusFilter) {
          params.append("status", statusFilter);
          // 之後這裡也可以加 startDate / endDate
          // if (startDate) params.append("startDate", startDate);
          // if (endDate) params.append("endDate", endDate);
        }

        // 3. 組 URL（有條件就加 ?xxx，沒有就用 baseUrl）
        const queryString = params.toString();
        const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

        // 4. fetch（不管有沒有篩選）
        const res = await fetch(url);
        const data = await res.json();

        // 如果 HTTP 狀態碼不是 2xx，丟錯誤（交給 catch 處理）
        if (!res.ok) {
          throw new Error(data.error || `載入訂單失敗，狀態碼：${res.status}`);
        }

        // 走到這裡代表成功，更新 orders
        setOrders(data);
      } catch (err) {
        setError(err.message || "載入訂單失敗");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
    // 只在第一次畫面出現時跑一次）用[] 請記得啊 但如果是希望 後台有一個「重新整理」按鈕 當用戶點擊重整 refreshKey  state改變 去更新table
  }, [refreshKey]);
  async function handleShipOrder() {
    if (!selectedOrder) return;

    if (!trackingNumber.trim()) {
      alert("請先輸入物流單號");
      return;
    }

    try {
      // 可以在這裡視情況顯示 loading 狀態，但先用 alert 簡單處理
      const res = await fetch(
        `http://localhost:8080/api/admin/orders/${selectedOrder.orderId}/ship`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingNumber }),
        }
      );

      if (!res.ok) {
        throw new Error(`出貨失敗，狀態碼：${res.status}`);
      }

      const data = await res.json(); // 後端回傳 { message, order }

      alert("出貨成功");
      setTrackingNumber(""); // 清空輸入框
      setSelectedOrder(data.order); // 更新目前明細
      setRefreshKey((prev) => prev + 1); // 重新整理上方列表
    } catch (err) {
      alert(err.message || "出貨時發生錯誤");
    }
  }

  // 先留空，等一下一步一步加東西
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">後台訂單列表</h1>

      {/* 上方工具列：重新整理按鈕 ,狀態選擇,日期篩選 */}
      <div className="flex items-center gap-2 justify-between mb-4">
        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-100 rounded border hover:bg-gray-200"
        >
          重新整理訂單
        </button>
        {/* select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">全部狀態</option>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="shipped">shipped</option>
        </select>
        {/* 日期篩選*/}

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">起始日期</label>
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <label className="text-sm text-gray-600">結束日期</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-4">
          {loading && <span className="text-sm text-gray-500">載入中...</span>}
          {error && (
            <span className="text-sm text-red-500">載入失敗：{error}</span>
          )}
        </div>
      </div>

      {/* 訂單列表 */}
      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-500">目前沒有任何訂單</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3">訂單編號</th>
                <th className="text-left p-3">狀態</th>
                <th className="text-right p-3">金額</th>
                <th className="text-left p-3">訂單時間</th>
                <th className="text-left p-3">物流單號</th>
                <th className="text-left p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs md:text-sm">
                    {order.orderId}
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold">
                    NT$ {order.amount}
                  </td>
                  <td className="p-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("zh-TW")
                      : "-"}
                  </td>
                  <td className="p-3">
                    {order.trackingNumber || (
                      <span className="text-gray-400 text-xs">尚未出貨</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order)} // 點擊時，將 selectedOrder 從 null 設成這筆 order 物件
                      className="px-3 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !error && orders.length > 0 && selectedOrder && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">訂單明細</h2>

              {/* 上半部：訂單資訊 + 客戶資訊 */}
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                {/* 訂單資訊 */}
                <div>
                  <h3 className="font-semibold mb-2">訂單資訊</h3>
                  <p>訂單編號：{selectedOrder.orderId}</p>
                  <p>狀態:{selectedOrder.status}</p>
                  <p>金額:NT$ {selectedOrder.amount}</p>
                  <p>
                    建立時間：
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString(
                          "zh-TW"
                        )
                      : "-"}
                  </p>
                  <p>
                    物流單號：
                    {selectedOrder.trackingNumber || "尚未出貨"}
                  </p>
                </div>

                {/* 客戶資料 */}
                <div>
                  <h3 className="font-semibold mb-2">客戶資料</h3>
                  <p>姓名：{selectedOrder.customerInfo?.name}</p>
                  <p>電話：{selectedOrder.customerInfo?.phone}</p>
                  {selectedOrder.customerInfo?.address && (
                    <p>地址：{selectedOrder.customerInfo.address}</p>
                  )}
                  {selectedOrder.customerInfo?.email && (
                    <p>Email：{selectedOrder.customerInfo.email}</p>
                  )}
                </div>
              </div>

              {/* 商品列表 */}
              <div>
                <h3 className="font-semibold mb-2">商品明細</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-left p-2">品名</th>
                      <th className="text-right p-2">單價</th>
                      <th className="text-center p-2">數量</th>
                      <th className="text-right p-2">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-right">NT$ {item.price}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">NT$ {item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* 如果還沒出貨狀態不是shipped 要顯示 物流單號輸入 + 出貨按鈕 */}
          {selectedOrder && selectedOrder.status !== "shipped" && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">出貨操作</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="輸入物流單號(例如:BLACKCAT-XXX)"
                  className="border rounded px-3 py-2 w-64"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <button
                  onClick={handleShipOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  確認出貨
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//筆記 state flow
//1. 開始進入後台 打 /api/admin/orders   loading = ture , orders=[] , error =null 畫面顯示資料載入
// 2. 開始去後端抓資料（useEffect 裡 fetch） 發request 前  setLoading(true)
//  If 成功 setOrders(responseData) 	setError(null)（確保清掉舊錯誤）	setError(null)（確保清掉舊錯誤）顯示table
// else setError(error.message 或自訂訊息)

//（event handling） 觀念

//日期篩選  onChange 概念  要的是「我該在事件發生時執行哪一段程式？」
//錯誤 onChange={setEndDate(endDate.target.value)}
// 直接這樣寫會立刻執行setEndDate(endDate.target.value) 而不是等到 等待使用者改變日期時再執行時才執行。

//永遠要傳一個函式給 onChange，不要直接呼叫 setState。
//正確 onChange={(e) => setEndDate(e.target.value)}
