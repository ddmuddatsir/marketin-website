"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useGetUser } from "@/hooks/useGetUser";
import SIdeBar from "@/components/account/SIdeBar";
import MainProfile from "@/components/account/MainProfile";
import BankAccount from "@/components/account/BankAccount";
import Address from "@/components/account/Address";
import ChangePassword from "@/components/account/ChangePassword";

const AccountPage = () => {
  const router = useRouter();
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const userData = storedUser ? JSON.parse(storedUser) : null;

  const { data: user, isLoading } = useGetUser(userData.id);

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Akun Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="profile"
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Sidebar Tab (Kiri) */}
            <SIdeBar />

            {/* Konten Tab (Kanan) */}
            <div className="flex-1">
              <MainProfile user={user} />
              <BankAccount user={user} />
              <Address user={user} />
              <ChangePassword />

              <Button
                onClick={handleLogout}
                className="w-full mt-6"
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
