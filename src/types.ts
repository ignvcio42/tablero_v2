import { z } from "zod";

export const todoInput = z.string({
  required_error: "Todo is required",
}).min(1).max(50);