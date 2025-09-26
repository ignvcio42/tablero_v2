import { z } from "zod";
import { todoInput } from "~/types";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Aqui estan los metodos para los todos
export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return todos.map(({ id, text, description, done }) => ({ id, text, description, done }));
  }),
  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {

      // esperar 5 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return ctx.db.todo.create({
        data: {
          text: input.text,
          description: input.description,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        newTitle: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // esperar 5 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000));
      // throw new TRPCError({
      //   code: "INTERNAL_SERVER_ERROR",
      //   message: "No existe la tarea o no es tuya",
      // });

      const authorEmail = ctx.session.user.email;
      const todoExistente = await ctx.db.todo.findFirst({
        where: {
          id: input.id,
          user: {
            email: authorEmail,
          },
        },
      });

      if (!todoExistente) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No existe la tarea o no es tuya",
        });
      }

      const todoActualizado = await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.newTitle,
          description: input.description,
        },
      });

      return todoActualizado;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // esperar 5 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return ctx.db.todo.delete({
        where: {
          id: input,
        },
      });
    }),
  toggle: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.db.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),
});
