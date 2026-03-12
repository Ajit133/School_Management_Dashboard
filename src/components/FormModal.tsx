"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    data: any,
    setOpen: Dispatch<SetStateAction<boolean>>,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (type, data, setOpen, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (type, data, setOpen) => <StudentForm type={type} data={data} />,
  parent: (type, data, setOpen) => <ParentForm type={type} data={data} />,
  subject: (type, data, setOpen) => <SubjectForm type={type} data={data} />,
  class: (type, data, setOpen) => <ClassForm type={type} data={data} />,
  lesson: (type, data, setOpen) => <LessonForm type={type} data={data} />,
  exam: (type, data, setOpen) => <ExamForm type={type} data={data} />,
  assignment: (type, data, setOpen) => <AssignmentForm type={type} data={data} />,
  result: (type, data, setOpen) => <ResultForm type={type} data={data} />,
  event: (type, data, setOpen) => <EventForm type={type} data={data} />,
  announcement: (type, data, setOpen) => <AnnouncementForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: any;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-ajitYellow"
      : type === "update"
      ? "bg-ajitSky"
      : "bg-ajitPurple";

  const [open, setOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!id) return;
    const result = await deleteTeacher(String(id));
    if (result.success) {
      router.refresh();
      setOpen(false);
    } else {
      setDeleteError(true);
    }
  };

  const Form = () => {
    return type === "delete" && id ? (
      <div className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        {deleteError && (
          <p className="text-xs text-red-500 text-center">Something went wrong. Please try again.</p>
        )}
        <button
          onClick={handleDelete}
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </div>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, setOpen, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
