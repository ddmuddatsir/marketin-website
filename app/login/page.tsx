"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useLogin } from "@/hooks/useLogin";

const LoginForm = () => {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const { login, userData, formError, isPending } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
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

            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {userData && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-semibold">
            Welcome, {userData.firstName} {userData.lastName}
          </h3>
          <Image
            src={userData.image}
            alt="Profile"
            width={64}
            height={64}
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
