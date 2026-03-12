"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  gradeId: z.string().min(1, { message: "Grade is required!" }),
  classId: z.string().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent is required!" }),
  img: z.any().optional(),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
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
    classes: { id: number; name: string }[];
    parents: { id: string; name: string; surname: string }[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      gradeId: data?.gradeId ? String(data.gradeId) : "",
      classId: data?.classId ? String(data.classId) : "",
      parentId: data?.parentId || "",
    },
  });

  const [imgPreview, setImgPreview] = useState<string | undefined>(data?.photo);
  const [imgBase64, setImgBase64] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    setServerError(null);

    const payload = {
      ...formData,
      img: imgBase64,
      id: data?.id,
    };

    const result =
      type === "create"
        ? await createStudent(payload)
        : await updateStudent(payload);

    if (result.success) {
      router.refresh();
      setOpen(false);
      return;
    }

    setServerError(result.message || "Something went wrong. Please try again.");
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Birthday</label>
          <input
            type="date"
            defaultValue={
              data?.birthday
                ? new Date(data.birthday).toISOString().split("T")[0]
                : ""
            }
            {...register("birthday", { valueAsDate: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          />
          {errors.birthday?.message && (
            <p className="text-xs text-red-400">
              {errors.birthday.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex?.toLowerCase()}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            {imgPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgPreview}
                alt="preview"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <Image src="/upload.png" alt="" width={28} height={28} />
            )}
            <span>Upload a photo</span>
          </label>
          <input
            type="file"
            id="img"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  setImgPreview(base64);
                  setImgBase64(base64);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      </div>
      {relatedData && (
        <>
          <span className="text-xs text-gray-400 font-medium">
            Academic &amp; Guardian Information
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Grade</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("gradeId")}
                defaultValue={data?.gradeId ? String(data.gradeId) : ""}
              >
                <option value="">Select grade</option>
                {relatedData.grades.map((grade) => (
                  <option key={grade.id} value={String(grade.id)}>
                    Grade {grade.level}
                  </option>
                ))}
              </select>
              {errors.gradeId?.message && (
                <p className="text-xs text-red-400">
                  {errors.gradeId.message.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Class</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("classId")}
                defaultValue={data?.classId ? String(data.classId) : ""}
              >
                <option value="">Select class</option>
                {relatedData.classes.map((cls) => (
                  <option key={cls.id} value={String(cls.id)}>
                    {cls.name}
                  </option>
                ))}
              </select>
              {errors.classId?.message && (
                <p className="text-xs text-red-400">
                  {errors.classId.message.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Parent</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("parentId")}
                defaultValue={data?.parentId || ""}
              >
                <option value="">Select parent</option>
                {relatedData.parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name} {parent.surname}
                  </option>
                ))}
              </select>
              {errors.parentId?.message && (
                <p className="text-xs text-red-400">
                  {errors.parentId.message.toString()}
                </p>
              )}
            </div>
          </div>
        </>
      )}
      {serverError && (
        <p className="text-xs text-red-500">{serverError}</p>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
