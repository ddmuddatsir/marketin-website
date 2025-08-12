import { InfoCard, SummaryItem } from "@/components/ui/InfoCard";
import { OrderDetail } from "@/types/order";

interface OrderSummaryCardProps {
  order: OrderDetail;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <InfoCard title="Order Summary">
      <div className="space-y-2">
        <SummaryItem label="Subtotal" value={`$${order.total.toFixed(2)}`} />
        <SummaryItem label="Shipping" value="Free" />
        <SummaryItem
          label="Total"
          value={`$${order.total.toFixed(2)}`}
          isTotal={true}
        />
      </div>
    </InfoCard>
  );
}
