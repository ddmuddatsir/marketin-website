import { fetchUser } from "@/lib/api/user";
import { UserDetails } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id?: number) => {
  return useQuery<UserDetails>({
    queryKey: ["userDetails", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });
};
