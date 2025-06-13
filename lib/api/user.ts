import { UserDetails } from "@/types/user";
import axios from "axios";

export const fetchUser = async (id: number): Promise<UserDetails> => {
  const res = await axios.get(`https://dummyjson.com/users/${id || 1}`);
  return res.data;
};
