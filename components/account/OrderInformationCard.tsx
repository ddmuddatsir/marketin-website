import { InfoCard, InfoItem } from "@/components/ui/InfoCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderDetail } from "@/types/order";

interface OrderInformationCardProps {
  order: OrderDetail;
}

export function OrderInformationCard({ order }: OrderInformationCardProps) {
  const formatDate = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <InfoCard title="Order Information">
      <div className="space-y-3">
        <InfoItem label="Order Date" value={formatDate(order.createdAt)} />
        <InfoItem label="Payment Method" value={order.paymentMethod} />
        <InfoItem
          label="Order Status"
          value={<StatusBadge status={order.status} />}
        />
      </div>
    </InfoCard>
  );
}
