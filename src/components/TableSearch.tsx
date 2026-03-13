"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("search")?.toString().trim() ?? "";
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
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
        name="search"
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("search") ?? ""}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
