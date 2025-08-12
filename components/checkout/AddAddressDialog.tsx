"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAddress: (address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  }) => Promise<void>;
  onRefreshAddresses: () => void;
}

export function AddAddressDialog({
  open,
  onOpenChange,
  onAddAddress,
  onRefreshAddresses,
}: AddAddressDialogProps) {
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onAddAddress({ ...newAddress, isDefault: false });
    onOpenChange(false);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    });
    onRefreshAddresses();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            required
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
          />
          <Input
            required
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
          />
          <Input
            required
            placeholder="State"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
          />
          <Input
            required
            placeholder="Country"
            value={newAddress.country}
            onChange={(e) =>
              setNewAddress({ ...newAddress, country: e.target.value })
            }
          />
          <Input
            required
            placeholder="Zip Code"
            value={newAddress.zipCode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, zipCode: e.target.value })
            }
          />
          <Button type="submit" className="w-full mt-2">
            Add Address
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
