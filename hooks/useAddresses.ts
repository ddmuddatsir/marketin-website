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
    } catch (error: unknown) {
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
    // Store previous addresses state for rollback
    const previousAddresses = [...addresses];

    try {
      // OPTIMISTIC UPDATE: Add to UI immediately with temporary ID
      const tempAddress: Address = {
        ...addressData,
        id: `temp-${Date.now()}`, // Temporary ID
      } as Address;

      setAddresses((prev) => [...prev, tempAddress]);

      // Show immediate success feedback
      toast.success("Address added successfully");

      // Background server request
      const response = await addressesAPI.create(addressData as Address);

      // Replace temporary address with server response
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === tempAddress.id ? response.data : addr))
      );

      return response.data;
    } catch (error) {
      // ROLLBACK: Restore previous state on error
      setAddresses(previousAddresses);

      console.error("Error adding address:", error);
      toast.error("Failed to add address - changes have been reverted");
      throw error;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    // Store previous addresses state for rollback
    const previousAddresses = [...addresses];

    try {
      // OPTIMISTIC UPDATE: Update in UI immediately
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === id ? { ...addr, ...addressData } : addr
        )
      );

      // Show immediate success feedback
      toast.success("Address updated successfully");

      // Background server request
      const response = await addressesAPI.update(id, addressData);

      // Update with server response to ensure consistency
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? response.data : addr))
      );

      return response.data;
    } catch (error) {
      // ROLLBACK: Restore previous state on error
      setAddresses(previousAddresses);

      console.error("Error updating address:", error);
      toast.error("Failed to update address - changes have been reverted");
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    // Store previous addresses state for rollback
    const previousAddresses = [...addresses];

    try {
      // OPTIMISTIC UPDATE: Remove from UI immediately
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));

      // Show immediate success feedback
      toast.success("Address deleted successfully");

      // Background server request
      await addressesAPI.remove(id);
    } catch (error) {
      // ROLLBACK: Restore previous state on error
      setAddresses(previousAddresses);

      console.error("Error deleting address:", error);
      toast.error("Failed to delete address - address has been restored");
      throw error;
    }
  };

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchAddresses,
  };
}
