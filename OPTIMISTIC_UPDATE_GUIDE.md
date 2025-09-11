# Optimistic Update Implementation Guide

## Overview

Implementasi optimistic update telah diterapkan pada aplikasi ini untuk meningkatkan user experience dengan memberikan feedback visual yang langsung terhadap aksi user sebelum server merespons.

## ✅ Fitur yang Telah Diimplementasikan

### 1. Cart Management (useCart.ts)

#### **Add to Cart**

- **Optimistic Update**: Item langsung ditambahkan ke UI
- **Rollback**: Jika server error, item dihapus dari UI
- **Feedback**: Toast success/error yang sesuai

```typescript
const addToCart = async (productId: string | number, quantity = 1) => {
  // Store previous state untuk rollback
  const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

  // Update UI immediately
  setCart(optimisticCart);
  showSuccess("Added to Cart! 🛒");

  // Background server request
  // Jika gagal, rollback ke state sebelumnya
};
```

#### **Remove from Cart**

- **Optimistic Update**: Item langsung dihapus dari UI
- **Rollback**: Jika server error, item dikembalikan ke UI
- **Feedback**: "Item removed" atau "Network error - item has been restored"

#### **Update Quantity**

- **Optimistic Update**: Quantity langsung berubah di UI
- **Rollback**: Jika server error, quantity dikembalikan ke nilai sebelumnya
- **Feedback**: "Update Failed - quantity change has been reverted"

### 2. User Profile Management (useUserProfile.ts)

```typescript
const updateUserProfile = async (updates: Partial<UserProfile>) => {
  // Store previous state
  const previousProfile = { ...profile };

  // Update UI immediately
  setProfile({ ...profile, ...updates });
  showSuccess("Profile Updated");

  // Background server request
  // Rollback jika gagal
};
```

#### **Fitur**:

- Update nama, email, photo URL
- Sinkronisasi dengan Firebase Auth
- Rollback otomatis jika gagal

### 3. Address Management (useAddresses.ts)

#### **Add Address**

- **Optimistic Update**: Alamat baru langsung muncul dengan temporary ID
- **Server Sync**: ID temporary diganti dengan ID dari server
- **Rollback**: Alamat dihapus jika request gagal

#### **Update Address**

- **Optimistic Update**: Perubahan langsung terlihat
- **Rollback**: Data dikembalikan jika server error

#### **Delete Address**

- **Optimistic Update**: Alamat langsung hilang dari UI
- **Rollback**: Alamat dikembalikan jika request gagal
- **Feedback**: "Failed to delete address - address has been restored"

## 🔧 Mekanisme Rollback

### State Management

```typescript
// Store previous state untuk rollback
const previousCart = cart ? { ...cart, items: [...cart.items] } : null;

try {
  // Optimistic update
  setCart(optimisticCart);

  // Server request
  const response = await fetch(...);

  if (!response.ok) {
    // Rollback on server error
    setCart(previousCart);
    showError("Server error - changes have been reverted");
  }
} catch (error) {
  // Rollback on network error
  if (previousCart) {
    setCart(previousCart);
  }
  showError("Network error - changes have been reverted");
}
```

### Error Handling

1. **Server Errors (4xx/5xx)**: Rollback + pesan error spesifik
2. **Network Errors**: Rollback + pesan "Network error"
3. **Authentication Errors**: Redirect ke login page

## 🎯 User Experience Benefits

### Immediate Feedback

- ✅ Aksi terasa instant (no loading state)
- ✅ User tidak perlu menunggu server response
- ✅ Smooth interaction tanpa lag

### Error Recovery

- ✅ Automatic rollback jika gagal
- ✅ Clear error messages
- ✅ State consistency terjaga

### Loading States

- ✅ Minimal loading indicators
- ✅ Background processing
- ✅ Progressive enhancement

## 📱 Contoh Usage

### Cart Operations

```typescript
const { addToCart, removeFromCart, increaseQuantity } = useCart();

// Semua operasi ini akan langsung update UI
await addToCart("product-123", 2); // Langsung muncul di cart
await removeFromCart("product-123"); // Langsung hilang dari cart
await increaseQuantity("product-123"); // Quantity langsung +1
```

### Profile Updates

```typescript
const { updateProfile } = useUserProfile();

// Profile langsung terupdate di UI
await updateProfile({
  name: "New Name",
  email: "new@email.com",
});
```

### Address Management

```typescript
const { addAddress, updateAddress, deleteAddress } = useAddresses();

// Semua langsung terlihat di UI
await addAddress(newAddressData);
await updateAddress(id, changes);
await deleteAddress(id);
```

## 🚀 Performance Benefits

1. **Perceived Performance**: UI terasa lebih cepat
2. **Reduced Loading**: Minimal loading states
3. **Better UX**: Continuous workflow tanpa interruption
4. **Offline Resilience**: Local state tetap konsisten

## 🛡️ Error Handling Matrix

| Scenario         | Action   | Feedback                           | Recovery          |
| ---------------- | -------- | ---------------------------------- | ----------------- |
| Network Error    | Rollback | "Network error - changes reverted" | Retry available   |
| Server Error     | Rollback | Specific error message             | Auto-rollback     |
| Auth Error       | Redirect | "Login required"                   | Redirect to login |
| Validation Error | Rollback | Field-specific errors              | Form validation   |

## 🔄 State Synchronization

### Cart State

- **Local**: localStorage untuk offline access
- **Server**: Firebase/Database untuk persistence
- **Sync**: Background sync setelah optimistic update

### Profile State

- **Local**: React state untuk immediate UI
- **Firebase Auth**: untuk authentication profile
- **Backend**: untuk extended profile data

### Address State

- **Local**: React state array
- **Server**: REST API untuk CRUD operations
- **Sync**: Real-time dengan server responses

Implementasi ini memastikan user experience yang smooth dengan reliability yang tinggi melalui automatic error recovery dan state consistency.
