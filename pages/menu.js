import { menuItems } from "./data/mockMenu";
import { useAtom } from "jotai";
import { cartAtom, isCartOpenAtom } from "@/store";

export default function Menu({ products }) {
  // 直接從 store 拿資料，不用 props！
  const [cart, setCart] = useAtom(cartAtom);
  const [, setIsCartOpen] = useAtom(isCartOpenAtom);

  // 加入購物車的邏輯（從 _app.js 移過來）
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // 商品已存在，數量 +1
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // 新商品，加入購物車
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setIsCartOpen(true); // 打開購物車彈窗
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">紅騷羊肉麵</h1>
      <p className="text-xl text-center mb-4">購物車數量： {totalQuantity}</p>

      <ul>
        {products.map((product) => {
          return (
            <li
              key={product.id}
              className="border p-4 rounded-lg shadow-lg bg-white mb-4"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg text-red-600">${product.price}</p>
              <p className="text-gray-600">{product.description}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                加入購物車
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { products: menuItems },
  };
}
