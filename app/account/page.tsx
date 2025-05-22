"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";

interface Hair {
  color: string;
  type: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
  token?: string; // dari login response, opsional
}

const AccountPage = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ambil data login dari localStorage
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);

    // Fetch data lengkap user berdasarkan id (contoh: id=1)
    fetch(`https://dummyjson.com/users/${userData.id || 1}`)
      .then((res) => res.json())
      .then((detailedUser) => {
        // Gabungkan token dari data login ke detail user
        setUser({ ...detailedUser, token: userData.token });
        setLoading(false);
      })
      .catch(() => {
        // Jika error fetch data detail, tetap tampilkan data login saja
        setUser(userData);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full"
            />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName} ({user.maidenName})
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-600">Username: {user.username}</p>
            <p className="text-sm text-gray-600">Role: {user.role}</p>
            <p className="text-sm text-gray-600">
              Phone: {user.phone} | Birth Date: {user.birthDate}
            </p>
            <p className="text-sm text-gray-600">Age: {user.age}</p>
            <p className="text-sm text-gray-600">Gender: {user.gender}</p>
            <p className="text-sm text-gray-600">
              Blood Group: {user.bloodGroup}
            </p>
            <p className="text-sm text-gray-600">
              Height: {user.height} cm | Weight: {user.weight} kg
            </p>
            <p className="text-sm text-gray-600">Eye Color: {user.eyeColor}</p>
            <p className="text-sm text-gray-600">
              Hair: {user.hair.color}, {user.hair.type}
            </p>

            <p className="text-xs text-gray-400 mt-2 break-all">
              Token: {user.token}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Address</h3>
            <p>
              {user.address.address}, {user.address.city}, {user.address.state}{" "}
              {user.address.postalCode}
            </p>
            <p>{user.address.country}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Company</h3>
            <p>
              {user.company.name} - {user.company.department}
            </p>
            <p>{user.company.title}</p>
            <p>
              {user.company.address.address}, {user.company.address.city},{" "}
              {user.company.address.state}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Bank Info</h3>
            <p>Card Number: {user.bank.cardNumber}</p>
            <p>Card Type: {user.bank.cardType}</p>
            <p>Currency: {user.bank.currency}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Crypto Wallet</h3>
            <p>Coin: {user.crypto.coin}</p>
            <p>Wallet: {user.crypto.wallet}</p>
            <p>Network: {user.crypto.network}</p>
          </div>

          <Button onClick={handleLogout} className="w-full mt-4">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
