import { addLogin } from "@/lib/api/auth";
import { UserData } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formError, setFormError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (params: { username: string; password: string }) =>
      addLogin({
        ...params,
        expiresInMins: 30,
      }),
    onSuccess: (data) => {
      setUserData(data);
      setCookie("token", data.token);
      router.push("/account");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error?.response?.data?.message || "Gagal login. Coba lagi.";
      setFormError(msg);
    },
  });

  const login = (username: string, password: string) => {
    mutate({ username, password });
  };

  return {
    login,
    userData,
    formError,
    isPending,
  };
};
