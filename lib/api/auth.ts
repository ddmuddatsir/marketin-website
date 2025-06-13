import axios from "axios";

export const addLogin = async ({
  username,
  password,
  expiresInMins,
}: {
  username: string;
  password: string;
  expiresInMins: number;
}) => {
  const res = await axios.post("https://dummyjson.com/auth/login", {
    username,
    password,
    expiresInMins,
  });

  return res.data;
};
