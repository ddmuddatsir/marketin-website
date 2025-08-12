import Image from "next/image";

interface OrderItemProduct {
  id: string | number;
  title: string;
  price: number;
  thumbnail?: string;
  image?: string;
  brand?: string;
  category?: string;
  description?: string;
  images?: string[];
}

interface OrderItem {
  id: string;
  productId: string | number;
  quantity: number;
  product?: OrderItemProduct;
}

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        Order Details
      </h2>
      <div className="space-y-4">
        {items.map((item) =>
          item.product ? (
            <div
              key={item.product.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={
                    item.product.thumbnail ||
                    item.product.image ||
                    "/no-image.png"
                  }
                  alt={item.product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {item.product.title}
                </h3>
                {item.product.brand && (
                  <p className="text-sm text-gray-500 mb-1">
                    Brand: {item.product.brand}
                  </p>
                )}
                {item.product.category && (
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {item.product.category}
                  </p>
                )}
                {item.product.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.product.description}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${item.product.price.toFixed(2)} each
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
