import Image from "next/image";
import { cookies } from "next/headers";
import { logout } from "@/lib/auth";

const ROLE_DISPLAY: Record<string, string> = {
  admin:   "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent:  "Parent",
};

export default function Navbar() {
  const role = cookies().get("auth_role")?.value ?? "";
  const displayRole = ROLE_DISPLAY[role] ?? "User";
  // Capitalise role as a display name
  const displayName = displayRole;

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* User info */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{displayName}</span>
          <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
        </div>
        <Image
          src="/avatar.png"
          alt="User avatar"
          width={36}
          height={36}
          className="rounded-full"
        />

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            title="Sign out"
            className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-red-50 transition"
          >
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
              className="text-gray-500 hover:text-red-500 transition"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}