import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const TeacherPage = () => {
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        {/* Quick Stats */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-ajitSky p-4 rounded-md flex gap-4 flex-1 min-w-[140px]">
            <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-semibold">6</h1>
              <span className="text-sm text-gray-400">Classes</span>
            </div>
          </div>
          <div className="bg-ajitYellow p-4 rounded-md flex gap-4 flex-1 min-w-[140px]">
            <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-semibold">6</h1>
              <span className="text-sm text-gray-400">Lessons</span>
            </div>
          </div>
          <div className="bg-ajitPurpleLight p-4 rounded-md flex gap-4 flex-1 min-w-[140px]">
            <Image src="/student.png" alt="" width={24} height={24} className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-semibold">240</h1>
              <span className="text-sm text-gray-400">Students</span>
            </div>
          </div>
          <div className="bg-ajitSkyLight p-4 rounded-md flex gap-4 flex-1 min-w-[140px]">
            <Image src="/exam.png" alt="" width={24} height={24} className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-semibold">12</h1>
              <span className="text-sm text-gray-400">Exams</span>
            </div>
          </div>
        </div>
        {/* Schedule */}
        <div className="bg-white p-4 rounded-md flex-1" style={{ minHeight: "600px" }}>
          <h1 className="text-xl font-semibold">My Schedule</h1>
          <BigCalendar />
        </div>
        {/* Shortcuts */}
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Quick Access</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-ajitSkyLight hover:bg-ajitSky transition" href="/list/classes">
              My Classes
            </Link>
            <Link className="p-3 rounded-md bg-ajitPurpleLight hover:bg-purple-200 transition" href="/list/lessons">
              My Lessons
            </Link>
            <Link className="p-3 rounded-md bg-ajitYellowLight hover:bg-yellow-200 transition" href="/list/exams">
              My Exams
            </Link>
            <Link className="p-3 rounded-md bg-pink-50 hover:bg-pink-100 transition" href="/list/assignments">
              My Assignments
            </Link>
            <Link className="p-3 rounded-md bg-ajitSkyLight hover:bg-ajitSky transition" href="/list/results">
              My Results
            </Link>
            <Link className="p-3 rounded-md bg-ajitPurpleLight hover:bg-purple-200 transition" href="/list/students">
              My Students
            </Link>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
