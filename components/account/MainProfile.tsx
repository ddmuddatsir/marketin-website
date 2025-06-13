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
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold">
          {user.firstName} {user.lastName} ({user.maidenName})
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-600">Username: {user.username}</p>
        <p className="text-sm text-gray-600">Role: {user.role}</p>
        <p className="text-sm text-gray-600">
          Phone: {user.phone} | Birth: {user.birthDate}
        </p>
        <p className="text-sm text-gray-600">
          Age: {user.age} | Gender: {user.gender}
        </p>
        <p className="text-sm text-gray-600">
          Blood: {user.bloodGroup} | Eye: {user.eyeColor}
        </p>
        <p className="text-sm text-gray-600">
          Hair: {user.hair.color}, {user.hair.type}
        </p>
      </div>
    </TabsContent>
  );
};

export default MainProfile;
