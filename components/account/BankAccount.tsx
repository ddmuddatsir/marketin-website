import React from "react";
import { TabsContent } from "../ui/tabs";
import { UserDetails } from "@/types/user";

interface ProfileDetailProps {
  user: UserDetails;
}

const BankAccount = ({ user }: ProfileDetailProps) => {
  return (
    <TabsContent value="bank" className="space-y-2">
      <h3 className="font-semibold">Informasi Bank</h3>
      <p>Kartu: {user.bank.cardNumber}</p>
      <p>Tipe: {user.bank.cardType}</p>
      <p>Expired: {user.bank.cardExpire}</p>
      <p>Mata Uang: {user.bank.currency}</p>
      <p>IBAN: {user.bank.iban}</p>
      <div className="border-t pt-4">
        <h4 className="font-semibold">Crypto Wallet</h4>
        <p>Coin: {user.crypto.coin}</p>
        <p>Wallet: {user.crypto.wallet}</p>
        <p>Network: {user.crypto.network}</p>
      </div>
    </TabsContent>
  );
};

export default BankAccount;
