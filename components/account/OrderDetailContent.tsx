import { PageHeader } from "@/components/ui/PageHeader";
import { OrderItemsList } from "./OrderItemsList";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderInformationCard } from "./OrderInformationCard";
import { ShippingAddressCard } from "./ShippingAddressCard";
import { OrderDetailActions } from "./OrderDetailActions";
import { OrderDetail } from "@/types/order";
import { getStatusColorName } from "@/utils/orderUtils";

interface OrderDetailContentProps {
  order: OrderDetail;
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <>
      <PageHeader
        title="Order Details"
        subtitle={`Order #${order.id.slice(-8)}`}
        status={{
          label: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          color: getStatusColorName(order.status),
        }}
        backButton={{
          label: "Back to Orders",
          href: "/account/orders",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <OrderItemsList order={order} />
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          <OrderSummaryCard order={order} />
          <OrderInformationCard order={order} />
          <ShippingAddressCard order={order} />
        </div>
      </div>

      <OrderDetailActions />
    </>
  );
}
