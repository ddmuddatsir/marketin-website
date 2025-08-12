import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  itemsCount: number;
  total: number;
  loading: boolean;
  error: string;
  addressId: string | null;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  itemsCount,
  total,
  loading,
  error,
  addressId,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({itemsCount} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

      <Button
        className="w-full mt-4 py-3 text-lg font-semibold"
        onClick={onPlaceOrder}
        disabled={loading || !addressId}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}
