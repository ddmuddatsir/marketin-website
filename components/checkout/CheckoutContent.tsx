"use client";
import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { OrderItems } from "./OrderItems";
import { ShippingAddress } from "./ShippingAddress";
import { PaymentMethod } from "./PaymentMethod";
import { OrderSummary } from "./OrderSummary";
import { AddAddressDialog } from "./AddAddressDialog";
import { CheckoutLoading, ProductLoading, EmptyCart } from "./CheckoutLoading";

export function CheckoutContent() {
  const {
    user,
    authLoading,
    addresses,
    addressId,
    setAddressId,
    loadingProduct,
    isDirectOrder,
    items,
    total,
    error,
    loading,
    handleOrder,
    addAddress,
    fetchAddresses,
  } = useCheckout();

  const [showAddAddress, setShowAddAddress] = useState(false);

  // Loading states
  if (authLoading) {
    return <CheckoutLoading />;
  }

  // AuthGuard handles authentication, so we can assume user exists here
  if (!user) {
    return <CheckoutLoading />;
  }

  if (loadingProduct) {
    return <ProductLoading />;
  }

  if (!isDirectOrder && (!items || items.length === 0)) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isDirectOrder ? "Direct Order Confirmation" : "Order Confirmation"}
        </h1>

        {isDirectOrder && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-4xl mx-auto">
            <p className="text-blue-800 text-center">
              🚀 You&apos;re ordering this item directly. This will not affect
              your shopping cart.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Product Details */}
          <div className="lg:col-span-2">
            <OrderItems items={items} />
          </div>

          {/* Right Side - Address, Payment & Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <ShippingAddress
                addresses={addresses}
                addressId={addressId}
                onAddressChange={setAddressId}
                onAddNewAddress={() => setShowAddAddress(true)}
              />

              <PaymentMethod />

              <OrderSummary
                itemsCount={items.length}
                total={total}
                loading={loading}
                error={error}
                addressId={addressId}
                onPlaceOrder={handleOrder}
              />
            </div>
          </div>
        </div>

        <AddAddressDialog
          open={showAddAddress}
          onOpenChange={setShowAddAddress}
          onAddAddress={addAddress}
          onRefreshAddresses={fetchAddresses}
        />
      </div>
    </div>
  );
}
