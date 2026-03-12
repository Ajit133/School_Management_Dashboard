"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClass, updateClass } from "@/lib/actions";
import InputField from "../InputField";

const schema = z.object({
  name: z.string().min(1, { message: "Class name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    grades: { id: number; level: number }[];
    teachers: { id: string; name: string; surname: string }[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name || "",
      capacity: data?.capacity || 1,
      gradeId: data?.gradeId || data?.grade?.id || undefined,
      supervisorId: data?.supervisorId || data?.supervisor?.id || "",
    },
  });

  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const payload = {
        name: formData.name,
        capacity: formData.capacity,
        gradeId: formData.gradeId,
        supervisorId: formData.supervisorId || undefined,
      };
      const result =
        type === "create"
          ? await createClass(payload)
          : await updateClass(data.id, payload);

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Operation successful!" });
        if (type === "create") reset({ name: "", capacity: 1, gradeId: undefined, supervisorId: "" });
        router.refresh();
        setTimeout(() => setOpen(false), 800);
      } else {
        setMessage({ type: "error", text: result.message || "Something went wrong!" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "An unexpected error occurred!" });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update class"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId || data?.grade?.id || ""}
          >
            <option value="">Select grade</option>
            {relatedData?.grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                Grade {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId || data?.supervisor?.id || ""}
          >
            <option value="">Unassigned</option>
            {relatedData?.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">{errors.supervisorId.message.toString()}</p>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-white ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Loading..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
