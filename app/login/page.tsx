"use client";

import { useAuth } from "@/lib/auth-context/auth-context";
import { NotepadText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth() as any;

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const { loginWithGoogle } = useAuth() as any;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error(error);
    }
    router.push("/");
  };

  return (
    <div className="relative last:w-screen h-screen flex flex-col items-center justify-center lg:flex-row bg-pink-50">
      <div className="flex-1 flex flex-col items-center justify-center lg:items-start lg:w-1/2 lg:px-20 ">
        <div className="flex items-center justify-center space-x-2 ">
          <NotepadText className="text-fuchsia-950" />
          <div className="text-3xl font-bold text-fuchsia-950">Taskbuddy</div>
        </div>
        <div className="px-6 text-xs lg:text-base text-center lg:text-start mt-2 lg:px-0">
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </div>
        <div
          onClick={handleLogin}
          className="bg-neutral-800 flex items-center justify-center mt-6 px-4 py-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            style={{ flex: "none", lineHeight: 1 }}
            viewBox="0 0 24 24"
            width="1em"
          >
            <title>Google</title>
            <path
              d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z"
              fill="#4285F4"
            />
            <path
              d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z"
              fill="#FBBC05"
            />
            <path
              d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z"
              fill="#EB4335"
            />
          </svg>
          <div className="text-white ml-2">Continue with Google</div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 z-[99999]">
        <img src="/Mainpage.png" alt="main page" className="rounded-lg" />
      </div>
      <div className="fixed hidden lg:flex items-center justify-center right-0">
        <div className="xl:w-[900px] xl:h-[900px] w-[700px] h-[700px] rounded-full border-2 border-fuchsia-100 flex items-center justify-center">
          <div className="xl:w-[800px] xl:h-[800px] w-[600px] h-[600px] rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
            <div className="xl:w-[700px] xl:h-[700px] w-[500px] h-[500px] rounded-full border-2 border-fuchsia-500"></div>
          </div>
        </div>
      </div>

      <div className="fixed lg:hidden flex items-center justify-center top-[-131px] right-[-105px]">
        <div className="w-64 h-64 rounded-full border-2 border-fuchsia-100 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-fuchsia-500"></div>
          </div>
        </div>
      </div>
      <div
        className="fixed lg:hidden flex items-center justify-center left-[-157px]
    top-[83px]"
      >
        <div className="w-64 h-64 rounded-full border-2 border-fuchsia-100 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-fuchsia-500"></div>
          </div>
        </div>
      </div>
      <div className="fixed lg:hidden flex items-center justify-center bottom-4">
        <div className="w-64 h-64 rounded-full border-2 border-fuchsia-100 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-fuchsia-300 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-fuchsia-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
