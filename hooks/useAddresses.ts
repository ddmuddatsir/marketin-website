import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/user";
import { addressesAPI } from "@/lib/api/client";

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAddresses = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await addressesAPI.getAll();
      // Only update state if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        setAddresses(response.data);
        setError(null);
      }
    } catch (error: any) {
      // Don't show error if request was aborted
      if (!abortControllerRef.current?.signal.aborted) {
        console.error("Error fetching addresses:", error);
        setError("Failed to load addresses");
        toast.error("Failed to load addresses");
      }
    } finally {
      // Only update loading if request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
      setAddresses([]);
      setError(null);
    }

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
