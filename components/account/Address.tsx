import React from "react";
import { TabsContent } from "../ui/tabs";
import { UserDetails } from "@/types/user";

interface ProfileDetailProps {
  user: UserDetails;
}

const Address = ({ user }: ProfileDetailProps) => {
  return (
    <TabsContent value="address" className="space-y-2">
      <h3 className="font-semibold">Alamat Rumah</h3>
      <p>
        {user.address.address}, {user.address.city}
      </p>
      <p>
        {user.address.state}, {user.address.country} {user.address.postalCode}
      </p>

      <div className="border-t pt-4">
        <h4 className="font-semibold">Perusahaan</h4>
        <p>
          {user.company.name} - {user.company.department}
        </p>
        <p>{user.company.title}</p>
        <p>
          {user.company.address.address}, {user.company.address.city},{" "}
          {user.company.address.state}
        </p>
      </div>
    </TabsContent>
  );
};

export default Address;
