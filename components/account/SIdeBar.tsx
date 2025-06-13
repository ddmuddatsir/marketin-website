import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const SIdeBar = () => {
  return (
    <TabsList className="flex md:flex-col md:w-52 gap-2">
      <TabsTrigger value="profile">Profil</TabsTrigger>
      <TabsTrigger value="bank">Bank & Kartu</TabsTrigger>
      <TabsTrigger value="address">Alamat</TabsTrigger>
      <TabsTrigger value="password">Ubah Password</TabsTrigger>
    </TabsList>
  );
};

export default SIdeBar;
