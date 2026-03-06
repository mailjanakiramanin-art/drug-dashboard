import { db } from "./prisma"
import bcryptjs from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword)
}

export async function createUser(email: string, name: string, password: string) {
  const hashedPassword = await hashPassword(password)

  try {
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "VIEWER",
      },
    })
    return { success: true, user }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Email already exists", user: null }
    }
    return { success: false, error: "Failed to create user", user: null }
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { success: false, error: "Invalid email or password", user: null }
  }

  const isPasswordValid = await verifyPassword(password, user.password)

  if (!isPasswordValid) {
    return { success: false, error: "Invalid email or password", user: null }
  }

  return { success: true, user }
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  })
}
