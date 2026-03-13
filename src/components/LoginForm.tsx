"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

// Inline SVG icons – no extra package needed
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await login(data.username, data.password);
      if (result?.error) {
        setServerError(result.error);
      }
      // On success, the server action calls redirect() and navigates automatically
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Server-side error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {serverError}
        </div>
      )}

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          type="text"
          placeholder="Enter your username"
          autoComplete="username"
          disabled={isPending}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none
            focus:ring-2 focus:ring-[#C3EBFA] focus:border-transparent
            transition disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {errors.username && (
          <span role="alert" className="text-xs text-red-500">
            {errors.username.message}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isPending}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-sm outline-none
              focus:ring-2 focus:ring-[#C3EBFA] focus:border-transparent
              transition disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <span role="alert" className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 bg-[#C3EBFA] hover:bg-[#a8dffa] active:scale-[0.98]
          text-gray-700 font-semibold py-3 rounded-lg text-sm
          transition-all disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {isPending && (
          <svg
            className="animate-spin h-4 w-4 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
