"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createSubject, updateSubject } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Subject name is required!" }),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
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
    },
  });

  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      let result;

      if (type === "create") {
        result = await createSubject({ name: formData.name });
      } else {
        result = await updateSubject(data.id, { name: formData.name });
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Operation successful!",
        });
        reset();
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred!",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update subject"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
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
        {isLoading
          ? "Loading..."
          : type === "create"
            ? "Create"
            : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
