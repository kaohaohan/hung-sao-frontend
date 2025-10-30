import { useAtom } from "jotai";
import { cartAtom, confirmRemoveAtom } from "@/store";

export default function Checkout() {
  // 直接從 store 拿資料，不用 props！
  const [cart, setCart] = useAtom(cartAtom);
  const [, setConfirmRemove] = useAtom(confirmRemoveAtom);

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">購物車結帳</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">購物車是空的</p>
      ) : (
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
      )}
    </div>
  );
}
