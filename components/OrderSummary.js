import { useState } from "react";

export default function OrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  editable = false,
  onQuantityChange,
  onRemove,
  collapsible = false, // 新增：是否可折叠
}) {
  const [isOpen, setIsOpen] = useState(false); // 预设收起

  // 如果不可折叠，直接显示内容
  if (!collapsible) {
    return (
      <div>
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-4">商品明細</th>
              <th className="text-center p-4">單價</th>
              <th className="text-center p-4">數量</th>
              <th className="text-right p-4">小計</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.itemId || item.id} className="border-b">
                <td className="p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                </td>
                <td className="p-4 text-center">NT${item.price}</td>
                <td className="p-4">
                  {editable ? (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onQuantityChange(item, -1)}
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item, 1)}
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      {onRemove && (
                        <button
                          onClick={() => onRemove(item)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-center block">{item.quantity}</span>
                  )}
                </td>
                <td className="p-4 text-right font-bold">
                  NT${item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 金额明细 */}
        <div className="p-6 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>商品小計</span>
              <span>NT$ {subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>運費</span>
              <span>NT$ {shippingFee}</span>
            </div>
            <div className="border-t pt-2"></div>
            <div className="flex justify-between text-2xl font-bold">
              <span>合計</span>
              <span className="text-red-600">NT$ {total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 可折叠版本
  return (
    <div className="bg-white rounded-lg shadow">
      {/* 可点击的 Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center transition-colors"
      >
        <div>
          <div className="text-xl font-bold">合計: NT$ {total}</div>
          <div className="text-gray-600">購物車 ({items.length} 件)</div>
        </div>

        {/* 箭头 */}
        <div className="text-2xl transition-transform duration-300">
          {isOpen ? "▲" : "▼"}
        </div>
      </div>

      {/* 可折叠内容 */}
      {isOpen && (
        <div className="border-t">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-4">商品明細</th>
                <th className="text-center p-4">單價</th>
                <th className="text-center p-4">數量</th>
                <th className="text-right p-4">小計</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.itemId || item.id} className="border-b">
                  <td className="p-4">
                    <h3 className="font-semibold">{item.name}</h3>
                  </td>
                  <td className="p-4 text-center">NT${item.price}</td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-right font-bold">
                    NT${item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 金额明细 */}
          <div className="p-6 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>商品小計</span>
                <span>NT$ {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>運費</span>
                <span>NT$ {shippingFee}</span>
              </div>
              <div className="border-t pt-2"></div>
              <div className="flex justify-between text-2xl font-bold">
                <span>合計</span>
                <span className="text-red-600">NT$ {total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
