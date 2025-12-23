// utils/shippingCalculator.js
import { PRODUCT_VOLUME, DEFAULT_VOLUME } from "../config/products";

// 定義箱子規則 (由小到大排序)
const BOX_RULES = [
  { maxPoints: 2, price: 160, name: "小箱" },
  { maxPoints: 6, price: 240, name: "中箱" },
  { maxPoints: 12, price: 290, name: "大箱" },
];

export function calculateShippingFee(cartItems, shippingMethod) {
  // 1. 如果是店取，運費 0
  if (shippingMethod === "STORE_PICKUP") return 0;

  // 2. 計算總體積點數
  let totalPoints = 0;
  cartItems.forEach((item) => {
    // 取得該商品的體積點數，沒有就用預設值
    const points = PRODUCT_VOLUME[item.id] || DEFAULT_VOLUME;
    totalPoints += points * item.quantity;
  });

  // 3. 計算運費 (遞迴/累加邏輯)
  let remainingPoints = totalPoints;
  let totalFee = 0;

  // 如果一點都沒買
  if (totalPoints === 0) return 0;

  while (remainingPoints > 0) {
    if (remainingPoints > 12) {
      // 超過一個大箱，就先加一個大箱的錢，然後扣掉 12 點繼續算
      totalFee += 290;
      remainingPoints -= 12;
    } else {
      // 剩下的點數，找一個最適合的箱子
      const box = BOX_RULES.find((rule) => remainingPoints <= rule.maxPoints);
      if (box) {
        totalFee += box.price;
        remainingPoints = 0; // 裝完了
      } else {
        // 理論上不會跑到這，除非規則沒寫好
        totalFee += 290; // 強制算大箱
        remainingPoints = 0;
      }
    }
  }

  return totalFee;
}
