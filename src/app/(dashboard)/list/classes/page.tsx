import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import Image from "next/image";
import { Suspense } from "react";

type ClassList = Prisma.ClassGetPayload<{
  include: { grade: true; supervisor: true };
}>;

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const role = cookies().get("auth_role")?.value;
  const { page, search, ...queryParams } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const query: Prisma.ClassWhereInput = {};

  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
      {
        supervisor: {
          is: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { surname: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  if (queryParams.supervisorId) {
    query.supervisorId = queryParams.supervisorId;
  }

  if (queryParams.gradeId) {
    const gradeId = parseInt(queryParams.gradeId, 10);

    if (!Number.isNaN(gradeId)) {
      query.gradeId = gradeId;
    }
  }

  const [data, count, grades, teachers] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        grade: true,
        supervisor: true,
      },
      orderBy: { name: "asc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.class.count({ where: query }),
    prisma.grade.findMany({ orderBy: { level: "asc" } }),
    prisma.teacher.findMany({
      select: { id: true, name: true, surname: true },
      orderBy: [{ name: "asc" }, { surname: "asc" }],
    }),
  ]);

  const relatedData = { grades, teachers };

  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-ajitPurpleLight"
    >
      <td className="flex items-center gap-4 p-4 font-medium">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">Grade {item.grade.level}</td>
      <td className="hidden lg:table-cell">
        {item.supervisor
          ? `${item.supervisor.name} ${item.supervisor.surname}`
          : "Unassigned"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="class" type="update" data={item} relatedData={relatedData} />
              <FormModal table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Suspense fallback={null}>
            <TableSearch />
          </Suspense>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-ajitYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-ajitYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="class" type="create" relatedData={relatedData} />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Suspense fallback={null}>
        <Pagination page={currentPage} count={count} />
      </Suspense>
    </div>
  );
};

export default ClassListPage;
