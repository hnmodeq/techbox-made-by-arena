export type Role = "super_admin" | "editor" | "author" | "user";
export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  modules: string[];
  avatar?: string;
}
