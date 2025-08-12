import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/user";
import { addressesAPI } from "@/lib/api/client";

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to load addresses");
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user, fetchAddresses]);

  const addAddress = async (addressData: Omit<Address, "id">) => {
    try {
      const response = await addressesAPI.create(addressData as Address);
      setAddresses((prev) => [...prev, response.data]);
      toast.success("Address added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
      throw error;
    }
  };

  return {
    addresses,
    loading,
    error,
    addAddress,
    fetchAddresses,
  };
}
