import React from "react";
import { TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";

const ChangePassword = () => {
  return (
    <TabsContent value="password" className="space-y-4">
      <h3 className="font-semibold">Ubah Password</h3>
      <p className="text-sm text-gray-500">Masukkan password baru Anda.</p>
      <input
        type="password"
        placeholder="Password Baru"
        className="w-full border px-3 py-2 rounded-md"
      />
      <Button>Update Password</Button>
    </TabsContent>
  );
};

export default ChangePassword;
