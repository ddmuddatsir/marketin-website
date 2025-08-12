import React from "react";
import { TabsContent } from "../ui/tabs";
import { UserDetails } from "@/types/user";

interface ProfileDetailProps {
  user: UserDetails;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BankAccount = ({ user }: ProfileDetailProps) => {
  return (
    <TabsContent value="bank" className="space-y-2">
      <h3 className="font-semibold">Informasi Bank</h3>
      <div className="text-gray-500">
        <p>Informasi bank belum tersedia</p>
        <p>Silakan hubungi customer service untuk menambahkan informasi bank</p>
      </div>
      <div className="border-t pt-4">
        <h4 className="font-semibold">Crypto Wallet</h4>
        <div className="text-gray-500">
          <p>Informasi crypto wallet belum tersedia</p>
        </div>
      </div>
    </TabsContent>
  );
};

export default BankAccount;
