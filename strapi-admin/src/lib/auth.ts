import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-secret-change-in-production"
);

export interface AdminSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export async function createToken(user: AdminSession): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; token?: string }> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin || !admin.isActive) {
    return { success: false, error: "Invalid email or password" };
  }

  const validPassword = await bcrypt.compare(password, admin.passwordHash);

  if (!validPassword) {
    return { success: false, error: "Invalid email or password" };
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  const token = await createToken({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  return { success: true, token };
}

export async function createAdminUser(email: string, password: string, name?: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
      role: "SUPER_ADMIN",
    },
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
