import { useRouter } from "next/router";

export default function OrderComplete() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* 成功圖示 */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg  
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 標題 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">付款成功！</h1>

        {/* 說明 */}
        <p className="text-gray-600 mb-2">感謝您的購買</p>
        <p className="text-gray-600 mb-8">我們已收到您的訂單，將盡快為您處理</p>

        {/* 按鈕組 */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/menu")}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition"
          >
            返回菜單繼續選購
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            返回首頁
          </button>
        </div>

        {/* 提示 */}
        <p className="text-sm text-gray-500 mt-6">
          訂單確認信息已發送至您的聯絡方式
        </p>
      </div>
    </div>
  );
}
