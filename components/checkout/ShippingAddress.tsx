import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/user";

interface ShippingAddressProps {
  addresses: Address[];
  addressId: string | null;
  onAddressChange: (addressId: string) => void;
  onAddNewAddress: () => void;
}

export function ShippingAddress({
  addresses,
  addressId,
  onAddressChange,
  onAddNewAddress,
}: ShippingAddressProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
        <FaMapMarkerAlt className="text-red-500 w-5 h-5" />
        Shipping Address
      </h2>
      <div className="space-y-3">
        <select
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={addressId || ""}
          onChange={(e) => onAddressChange(e.target.value)}
        >
          {addresses.map((addr) => (
            <option key={addr.id} value={addr.id}>
              {addr.street || ""}, {addr.city || ""}, {addr.state || ""},{" "}
              {addr.country || ""}, {addr.zipCode || ""}
              {addr.isDefault ? " (Default)" : ""}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="secondary"
          onClick={onAddNewAddress}
          className="w-full"
        >
          Add New Address
        </Button>
      </div>
    </div>
  );
}
