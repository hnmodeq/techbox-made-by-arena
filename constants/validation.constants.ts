import { z } from "zod";
export const slugSchema = z.string().min(2).regex(/^[a-z0-9-]+$/);
export const faText = z.string().min(2).max(5000);
