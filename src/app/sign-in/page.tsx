import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In – School Management Dashboard",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="School logo" width={40} height={40} />
            <span className="text-2xl font-bold text-gray-800">EduManage</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-700">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-[#EDF9FD] rounded-xl text-xs text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-600 mb-1">Demo Credentials</p>
          <p>
            Admin:{" "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">admin</span>{" / "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">admin123</span>
          </p>
          <p>
            Teacher:{" "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">teacher</span>{" / "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">teacher123</span>
          </p>
          <p>
            Student:{" "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">student</span>{" / "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">student123</span>
          </p>
          <p>
            Parent:{" "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">parent</span>{" / "}
            <span className="font-mono bg-white px-1 py-0.5 rounded">parent123</span>
          </p>
        </div>
      </div>
    </div>
  );
}