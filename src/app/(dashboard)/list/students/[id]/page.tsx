import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const role = cookies().get("auth_role")?.value;

  const [student, attendanceCount, presentAttendanceCount, grades, classes, parents] =
    await prisma.$transaction([
      prisma.student.findUnique({
        where: { id },
        include: {
          class: {
            include: {
              grade: true,
              _count: { select: { lessons: true } },
            },
          },
          parent: true,
          _count: { select: { results: true } },
        },
      }),
      prisma.attendance.count({ where: { studentId: id } }),
      prisma.attendance.count({ where: { studentId: id, present: true } }),
      prisma.grade.findMany({ orderBy: { level: "asc" } }),
      prisma.class.findMany({ orderBy: { name: "asc" } }),
      prisma.parent.findMany({
        select: { id: true, name: true, surname: true },
        orderBy: [{ name: "asc" }, { surname: "asc" }],
      }),
    ]);

  if (!student) return notFound();

  const attendanceRate =
    attendanceCount > 0
      ? `${Math.round((presentAttendanceCount / attendanceCount) * 100)}%`
      : "N/A";

  const relatedData = { grades, classes, parents };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-ajitSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={
                  student.photo ||
                  "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name} {student.surname}
                </h1>
                {role === "admin" && (
                  <FormModal
                    table="student"
                    type="update"
                    data={{
                      id: student.id,
                      username: student.username,
                      email: student.email,
                      firstName: student.name,
                      lastName: student.surname,
                      phone: student.phone,
                      address: student.address,
                      bloodType: student.bloodType,
                      birthday: student.birthday,
                      sex: student.sex.toLowerCase(),
                      gradeId: student.gradeId,
                      classId: student.classId,
                      parentId: student.parentId,
                      photo: student.photo,
                    }}
                    relatedData={relatedData}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Parent: {student.parent.name} {student.parent.surname}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(
                      new Date(student.birthday)
                    )}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email ?? "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{attendanceRate}</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  Grade {student.class.grade.level}
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-ajitSkyLight"
              href={`/list/students?classId=${student.classId}`}
            >
              Classmates
            </Link>
            <Link
              className="p-3 rounded-md bg-ajitPurpleLight"
              href={`/list/students?gradeId=${student.gradeId}`}
            >
              Same Grade Students
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/list/results">
              Student&apos;s Results ({student._count.results})
            </Link>
            <Link
              className="p-3 rounded-md bg-ajitSkyLight"
              href="/list/assignments"
            >
              Assignments
            </Link>
            <Link className="p-3 rounded-md bg-ajitYellowLight" href="/list/parents">
              Parents Directory
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
