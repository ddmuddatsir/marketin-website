import React from "react";
import { TabsContent } from "../ui/tabs";
import Image from "next/image";
import { UserDetails } from "@/types/user";

interface ProfileDetailProps {
  user: UserDetails;
}

const MainProfile = ({ user }: ProfileDetailProps) => {
  return (
    <TabsContent value="profile" className="space-y-4">
      <div className="flex justify-center">
        <Image
          src={user.image || "/default-avatar.svg"}
          alt={user.name || "User"}
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-600">Role: {user.role}</p>
        <p className="text-sm text-gray-600">ID: {user.id}</p>
      </div>
    </TabsContent>
  );
};

export default MainProfile;
