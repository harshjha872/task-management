'use client';

import { useAuth } from "@/lib/auth-context/auth-context";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth() as any;

  const handleLogin = async (e:any) => {
    e.preventDefault();
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div onClick={handleLogin}>login</div>
  );
}