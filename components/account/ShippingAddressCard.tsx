import { InfoCard } from "@/components/ui/InfoCard";
import { OrderDetail } from "@/types/order";

interface ShippingAddressCardProps {
  order: OrderDetail;
}

export function ShippingAddressCard({ order }: ShippingAddressCardProps) {
  if (!order.shippingAddress) {
    return null;
  }

  return (
    <InfoCard title="Shipping Address">
      <div className="text-gray-700">
        <p>{order.shippingAddress.street}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>
    </InfoCard>
  );
}
