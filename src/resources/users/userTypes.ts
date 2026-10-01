import type { RaRecord } from "react-admin";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";
export type UserGender = "MALE" | "FEMALE" | "OTHER";

export interface UserRecord extends RaRecord {
  fullName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  age?: number;
  gender?: UserGender;
  isVerified: boolean;
  isActive: boolean;
  ordersCount: number;
  createdAt: string;
  lastLoginAt?: string;
}
