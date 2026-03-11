"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("page", "1");
    router.push(`?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <button type="submit">
        <Image src="/search.png" alt="Search" width={14} height={14} />
      </button>
      <input
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("search") ?? ""}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
