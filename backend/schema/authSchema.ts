import { z } from "zod";
import { registerApi } from "../swagger/swaggerHelper";

export const registerSchema = z.object({
  phone: z.number().min(1000000000).max(9999999999),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

registerApi("post", "/auth/register", registerSchema, "Auth");
registerApi("post", "/auth/login", loginSchema, "Auth");
registerApi("get", "/health", null, "Health");
registerApi("get", "/auth/logout", null, "Auth");