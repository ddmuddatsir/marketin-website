"use client";

import { setCookie } from "cookies-next";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setError("");
        // localStorage.setItem("user", JSON.stringify(data));
        setCookie("token", data.token);
        router.push("/account"); // ✅ pindah ke page account
      } else {
        setUserData(null);
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setUserData(null);
      setError("Network error");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Login DummyJSON</h2>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>

      {userData && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-semibold">
            Welcome, {userData.firstName} {userData.lastName}
          </h3>
          <img
            src={userData.image}
            alt="Profile"
            className="w-16 h-16 rounded-full my-2"
          />
          <p>Email: {userData.email}</p>
          <p className="mt-2 text-sm text-gray-500">Access Token:</p>
          <code className="break-all text-xs">{userData.token}</code>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
