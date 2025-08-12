export function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  );
}

export function CheckoutSuspenseLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function ProductLoading() {
  return <div className="p-8 text-center">Loading product details...</div>;
}

export function EmptyCart() {
  return <div className="p-8 text-center">Your cart is empty.</div>;
}
