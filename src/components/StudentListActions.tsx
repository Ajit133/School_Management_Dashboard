"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface StudentListActionsProps {
  allGrades: Array<{ id: number; level: number }>;
  allClasses: Array<{ id: number; name: string }>;
}

export default function StudentListActions({
  allGrades,
  allClasses,
}: StudentListActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get("gradeId") || ""
  );
  const [selectedClass, setSelectedClass] = useState(
    searchParams.get("classId") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const handleFilterApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedGrade) {
      params.set("gradeId", selectedGrade);
    } else {
      params.delete("gradeId");
    }

    if (selectedClass) {
      params.set("classId", selectedClass);
    } else {
      params.delete("classId");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setShowFilter(false);
  };

  const handleClearFilters = () => {
    setSelectedGrade("");
    setSelectedClass("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("gradeId");
    params.delete("classId");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
    setShowFilter(false);
  };

  const handleSort = (sortOption: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortOption);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
    setSortBy(sortOption);
    setShowSort(false);
  };

  return (
    <div className="relative flex items-center gap-4 self-end">
      <div className="relative">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-ajitYellow hover:bg-opacity-80 transition"
          title="Filter"
        >
          <Image src="/filter.png" alt="filter" width={14} height={14} />
        </button>

        {showFilter && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <h3 className="font-semibold mb-3 text-sm">Filter Students</h3>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                By Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
              >
                <option value="">All Grades</option>
                {allGrades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                By Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
              >
                <option value="">All Classes</option>
                {allClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleFilterApply}
                className="flex-1 bg-ajitSky text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowSort(!showSort)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-ajitYellow hover:bg-opacity-80 transition"
          title="Sort"
        >
          <Image src="/sort.png" alt="sort" width={14} height={14} />
        </button>

        {showSort && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
            <h3 className="font-semibold mb-2 text-sm px-2 pt-2">Sort By</h3>
            {[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "name-asc", label: "Name (A-Z)" },
              { value: "name-desc", label: "Name (Z-A)" },
              { value: "grade-asc", label: "Grade (Low-High)" },
              { value: "grade-desc", label: "Grade (High-Low)" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                  sortBy === option.value ? "bg-ajitSky text-white" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
