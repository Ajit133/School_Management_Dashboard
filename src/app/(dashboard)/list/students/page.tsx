import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import StudentSearchAutocomplete from "@/components/StudentSearchAutocomplete";
import StudentListActions from "@/components/StudentListActions";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type StudentList = Prisma.StudentGetPayload<{
  include: { class: { include: { grade: true } } };
}>;

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = cookies().get("auth_role")?.value;
  const { page, search, sortBy, ...queryParams } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const query: Prisma.StudentWhereInput = {};

  if (search) {
    const terms = search
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const baseSearch: Prisma.StudentWhereInput[] = [
      { name: { contains: search, mode: "insensitive" } },
      { surname: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];

    if (terms.length >= 2) {
      const first = terms[0];
      const rest = terms.slice(1).join(" ");

      baseSearch.push({
        AND: [
          { name: { contains: first, mode: "insensitive" } },
          { surname: { contains: rest, mode: "insensitive" } },
        ],
      });

      baseSearch.push({
        AND: [
          { name: { contains: rest, mode: "insensitive" } },
          { surname: { contains: first, mode: "insensitive" } },
        ],
      });
    }

    query.OR = baseSearch;
  }

  if (queryParams.gradeId) {
    const gradeId = parseInt(queryParams.gradeId, 10);
    if (!Number.isNaN(gradeId)) query.gradeId = gradeId;
  }

  if (queryParams.classId) {
    const classId = parseInt(queryParams.classId, 10);
    if (!Number.isNaN(classId)) query.classId = classId;
  }

  let orderBy: Prisma.StudentOrderByWithRelationInput = { createdAt: "desc" };

  if (sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortBy === "name-asc") {
    orderBy = { name: "asc" };
  } else if (sortBy === "name-desc") {
    orderBy = { name: "desc" };
  } else if (sortBy === "grade-asc") {
    orderBy = { grade: { level: "asc" } };
  } else if (sortBy === "grade-desc") {
    orderBy = { grade: { level: "desc" } };
  }

  const [data, count, grades, classes, parents] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: {
          include: {
            grade: true,
          },
        },
      },
      orderBy,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.student.count({ where: query }),
    prisma.grade.findMany({ orderBy: { level: "asc" } }),
    prisma.class.findMany({ orderBy: { name: "asc" } }),
    prisma.parent.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: [{ name: "asc" }, { surname: "asc" }],
    }),
  ]);

  const relatedData = { grades, classes, parents };

  const renderRow = (item: StudentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-ajitPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.photo || "/avatar.png"}
          alt=""
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
          <p className="text-xs text-gray-500">{item.class.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.class.grade.level}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ajitSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal
                table="student"
                type="update"
                data={{
                  id: item.id,
                  username: item.username,
                  email: item.email,
                  firstName: item.name,
                  lastName: item.surname,
                  phone: item.phone,
                  address: item.address,
                  bloodType: item.bloodType,
                  birthday: item.birthday,
                  sex: item.sex,
                  gradeId: item.gradeId,
                  classId: item.classId,
                  parentId: item.parentId,
                  photo: item.photo,
                }}
                relatedData={relatedData}
              />
              <FormModal table="student" type="delete" id={item.id}/>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Suspense fallback={null}>
            <StudentSearchAutocomplete />
          </Suspense>
          <div className="flex items-center gap-4 self-end">
            <StudentListActions allGrades={grades} allClasses={classes} />
            {role === "admin" && (
              <FormModal table="student" type="create" relatedData={relatedData}/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Suspense fallback={null}>
        <Pagination page={currentPage} count={count} />
      </Suspense>
    </div>
  );
};

export default StudentListPage;
