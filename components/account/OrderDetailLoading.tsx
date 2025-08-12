import { AccountLayout } from "./AccountLayout";

export function OrderDetailLoading() {
  return (
    <AccountLayout>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading order details...</span>
      </div>
    </AccountLayout>
  );
}
