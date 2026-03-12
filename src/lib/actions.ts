"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { UserSex } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Demo credential store – replace with a real DB query in production.
// ---------------------------------------------------------------------------
const CREDENTIALS = [
  { username: "admin",   password: "admin123",   role: "admin"   },
  { username: "teacher", password: "teacher123", role: "teacher" },
  { username: "student", password: "student123", role: "student" },
  { username: "parent",  password: "parent123",  role: "parent"  },
] as const;

const ROLE_HOME: Record<string, string> = {
  admin:   "/admin",
  teacher: "/teacher",
  student: "/student",
  parent:  "/parent",
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function login(
  username: string,
  password: string
): Promise<{ error: string } | undefined> {
  // Trim to avoid whitespace mistakes
  const user = CREDENTIALS.find(
    (u) =>
      u.username === username.trim() &&
      u.password === password
  );

  if (!user) {
    return { error: "Invalid username or password." };
  }

  cookies().set("auth_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect(ROLE_HOME[user.role]);
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function logout() {
  cookies().delete("auth_role");
  redirect("/sign-in");
}

// ---------------------------------------------------------------------------
// Teacher CRUD
// ---------------------------------------------------------------------------
export async function createTeacher(
  data: any
): Promise<{ success: boolean; error: boolean }> {
  try {
    const subjects = (data.subjects ?? []).map((id: string) => ({ id: parseInt(id, 10) }));
    const classes = (data.classes ?? []).map((id: string) => ({ id: parseInt(id, 10) }));

    await prisma.teacher.create({
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email || undefined,
        photo: data.img || undefined,
        phone: data.phone || undefined,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex === "male" ? UserSex.MALE : UserSex.FEMALE,
        subjects: {
          connect: subjects,
        },
        classes: {
          connect: classes,
        },
      },
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
}

export async function updateTeacher(
  data: any
): Promise<{ success: boolean; error: boolean }> {
  try {
    const subjects = (data.subjects ?? []).map((id: string) => ({ id: parseInt(id, 10) }));
    const classes = (data.classes ?? []).map((id: string) => ({ id: parseInt(id, 10) }));

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email || undefined,
        photo: data.img || undefined,
        phone: data.phone || undefined,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex === "male" ? UserSex.MALE : UserSex.FEMALE,
        subjects: {
          set: subjects,
        },
        classes: {
          set: classes,
        },
      },
    });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
}

export async function deleteTeacher(
  id: string
): Promise<{ success: boolean; error: boolean }> {
  try {
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
}

// ---------------------------------------------------------------------------
// Student CRUD
// ---------------------------------------------------------------------------
export async function createStudent(
  data: any
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    await prisma.student.create({
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email || undefined,
        photo: data.img || undefined,
        phone: data.phone || undefined,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex === "male" ? UserSex.MALE : UserSex.FEMALE,
        gradeId: parseInt(data.gradeId, 10),
        classId: parseInt(data.classId, 10),
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: true,
      message: "Failed to create student. Please check unique fields and required relations.",
    };
  }
}

export async function updateStudent(
  data: any
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.firstName,
        surname: data.lastName,
        email: data.email || undefined,
        photo: data.img || undefined,
        phone: data.phone || undefined,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex === "male" ? UserSex.MALE : UserSex.FEMALE,
        gradeId: parseInt(data.gradeId, 10),
        classId: parseInt(data.classId, 10),
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: true,
      message: "Failed to update student.",
    };
  }
}

export async function deleteStudent(
  id: string
): Promise<{ success: boolean; error: boolean }> {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
}

// ---------------------------------------------------------------------------
// Subject CRUD
// ---------------------------------------------------------------------------
export async function getSubjects() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teachers: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });
    
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      teachers: subject.teachers.map((t) => `${t.name} ${t.surname}`),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createSubject(
  data: any
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    // Check if subject already exists
    const existingSubject = await prisma.subject.findUnique({
      where: { name: data.name },
    });

    if (existingSubject) {
      return { success: false, error: true, message: "Subject already exists!" };
    }

    await prisma.subject.create({
      data: {
        name: data.name,
        // Teachers will be linked separately if needed
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false, message: "Subject created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create subject" };
  }
}

export async function updateSubject(
  id: number,
  data: any
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    await prisma.subject.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false, message: "Subject updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update subject" };
  }
}

export async function deleteSubject(
  id: number
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    await prisma.subject.delete({ where: { id } });
    revalidatePath("/list/subjects");
    return { success: true, error: false, message: "Subject deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete subject" };
  }
}

// ---------------------------------------------------------------------------
// Class CRUD
// ---------------------------------------------------------------------------
export async function createClass(
  data: {
    name: string;
    capacity: number;
    gradeId: number;
    supervisorId?: string;
  }
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    const existingClass = await prisma.class.findUnique({
      where: { name: data.name },
    });

    if (existingClass) {
      return { success: false, error: true, message: "Class name already exists!" };
    }

    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId || null,
      },
    });

    revalidatePath("/list/classes");
    return { success: true, error: false, message: "Class created successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to create class" };
  }
}

export async function updateClass(
  id: number,
  data: {
    name: string;
    capacity: number;
    gradeId: number;
    supervisorId?: string;
  }
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    const existingClass = await prisma.class.findFirst({
      where: { name: data.name, NOT: { id } },
    });

    if (existingClass) {
      return { success: false, error: true, message: "Class name already exists!" };
    }

    await prisma.class.update({
      where: { id },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId || null,
      },
    });

    revalidatePath("/list/classes");
    return { success: true, error: false, message: "Class updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to update class" };
  }
}

export async function deleteClass(
  id: number
): Promise<{ success: boolean; error: boolean; message?: string }> {
  try {
    await prisma.class.delete({ where: { id } });
    revalidatePath("/list/classes");
    return { success: true, error: false, message: "Class deleted successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: true, message: "Failed to delete class" };
  }
}

