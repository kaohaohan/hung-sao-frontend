// store.js
// 全域狀態管理中心

import { atom } from "jotai";

// 購物車內容
export const cartAtom = atom([]);

// 購物車彈窗開關
export const isCartOpenAtom = atom(false);

// 確認刪除的商品
export const confirmRemoveAtom = atom(null);
