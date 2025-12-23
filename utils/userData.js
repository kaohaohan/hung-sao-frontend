//"DeliveryTime": "04"
const DELIVERY_TIME_MAP = {
  // --- 黑貓定義 (外部) ---
  "01": "13:00 前",
  "02": "14:00 - 18:00",
  "03": "17:00 - 20:00", // (舊制，保留以防萬一)
  "04": "不指定",

  // --- 你的定義 (內部) ---
  before_13: "13:00 前",
  "14_18": "14:00 - 18:00",
  anytime: "不指定",
};

const PAYMENT_METHOD_MAP = {
  COD: "貨到付款",
  CREDIT_CARD: "信用卡付款",

  // 如果未來綠界直接回傳 "Credit" 或 "ATM"，也可以先寫起來放
  Credit: "信用卡付款",
  ATM: "ATM 轉帳",
  CVS: "超商代碼繳費",
  // ... 寫下其他的
};

//Thermosphere": "0002",
const TEMPERATURE_MAP = {
  "0001": "常溫",
  "0002": "冷藏",
  "0003": "冷凍",
};
export const translateTimeSlot = (code) => {
  return DELIVERY_TIME_MAP[code] || "不指定";
};

export const translateTemp = (code) => {
  return TEMPERATURE_MAP[code] || "低溫";
};

export const translatePayment = (code) => {
  return PAYMENT_METHOD_MAP[code] || "付款方式不明";
};
