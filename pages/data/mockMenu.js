// data/mockMenu.js

// 這是我們模擬的「核心資料層」
// 未來這份資料會來自後端 API
export const menuItems = [
  {
    id: "p01",
    name: "紅騷羊肉湯真空包裝",
    price: 180,
    description: "真材實料，嚴選 800g",
    images: [
      "/images/hong-sao-mutton-vacuum.jpg",
      "/images/hong-sao-mutton-noodles.jpg"
    ],
  },
  {
    id: "p02",
    name: "紅騷羊肉圖片",
    price: 180,
    description: "示意圖",
    image: "/images/hong-sao-mutton-noodles.jpg",
  },
  {
    id: "p03",
    name: "當歸羊肉真空包裝",
    price: 180,
    description: "香氣濃郁，滋補強身",
    images: [
      "/images/hong-sao-angelica-vacuum.jpg",
      "/images/hong-sao-angelica-noodles.jpg"
    ],
  },
  {
    id: "p04",
    name: "當歸羊肉麵線",
    price: 120,
    description: "暖胃好選擇",
    image: "/images/hong-sao-angelica-noodles.jpg",
  },
];
