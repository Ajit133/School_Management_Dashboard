"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TeacherSuggestion = {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string | null;
};

const TeacherSearchAutocomplete = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSearch = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<TeacherSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const applySearch = (value: string, mode: "push" | "replace" = "push") => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedValue = value.trim();

    if (normalizedValue) {
      params.set("search", normalizedValue);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    const next = `?${params.toString()}`;
    if (mode === "replace") {
      router.replace(next);
    } else {
      router.push(next);
    }
  };

  useEffect(() => {
    if (currentSearch !== query) {
      setQuery(currentSearch);
    }
  }, [currentSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();

    const params = new URLSearchParams(searchParams.toString());
    if (trimmedQuery) params.set("search", trimmedQuery);
    else params.delete("search");
    params.set("page", "1");

    const nextParams = params.toString();
    const currentParams = searchParams.toString();

    const timer = setTimeout(() => {
      if (nextParams !== currentParams) {
        applySearch(trimmedQuery, "replace");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchParams]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/teachers/autocomplete?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const result = (await response.json()) as {
          items?: TeacherSuggestion[];
        };

        setSuggestions(result.items ?? []);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const applySuggestion = (value: string) => {
    setQuery(value);
    applySearch(value, "push");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full md:w-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applySearch(query, "push");
          setIsOpen(false);
        }}
        className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 bg-white"
      >
        <button type="submit">
          <Image src="/search.png" alt="Search" width={14} height={14} />
        </button>
        <input
          name="search"
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teachers..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </form>

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="px-3 py-2 text-xs text-gray-500">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500">No matches found</div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      applySuggestion(`${item.name} ${item.surname}`.trim())
                    }
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {item.name} {item.surname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.username}
                      {item.email ? ` • ${item.email}` : ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherSearchAutocomplete;
