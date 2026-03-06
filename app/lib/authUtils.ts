import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthPayload {
  userId: string
  email: string
  role: "VIEWER" | "EDITOR" | "ADMIN"
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  return request.cookies.get("auth_token")?.value || null
}

export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: { [key: string]: number } = {
    VIEWER: 1,
    EDITOR: 2,
    ADMIN: 3,
  }

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || Infinity)
}

export async function getAuthUser(request: NextRequest) {
  const token = extractToken(request)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  const user = await db.user.findUnique({
    where: { email: payload.email },
  })

  return user
}
