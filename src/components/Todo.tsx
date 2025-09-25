import React, { useState } from "react";
import { api } from "~/utils/api";
import type { Todo } from "~/types";
import { Input } from "postcss";
import toast from "react-hot-toast";

type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;

  const utils = api.useUtils();

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const updateMutation = api.todo.update.useMutation({
    onMutate: (inputEnviado) => {
      setIsEditing(false);
      const optimisticUpdate = utils.todo.all.getData();

      //   console.log({ inputEnviado });

      if (optimisticUpdate) {
        const todosActualizados = optimisticUpdate.map((todo) => {
          if (todo.id !== inputEnviado.id) {
            return todo;
          }

          return {
            ...todo,
            text: inputEnviado.newTitle,
          };
        });

        console.log({ todosActualizados });

        utils.todo.all.setData(undefined, todosActualizados);
      }
    },
    onSuccess: async (dataDevueltaPorElServidor) => {
      //   await utils.todo.all.refetch();
    },
    onError: async (errorDevueltoPorElServidor) => {
      toast.error(errorDevueltoPorElServidor.message);
      console.log({ errorDevueltoPorElServidor });
      await utils.todo.all.invalidate();
      //   console.log("onError");
    },
    onSettled: () => {
      console.log("onSettled");
    },
  });

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {!isEditing ? (
        <>
          <div className="flex flex-1 items-center gap-2">
            <input
              placeholder="Input component"
              className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              type="checkbox"
              name="done"
              id="done"
              checked={done}
            />
            <label htmlFor="done" className={"cursor-pointer"}>
              {text}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => {
                setIsEditing(true);
                setNewText(text);
              }}
            >
              Editar
            </button>
            <button className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            placeholder="Input component"
            className="focus:ring-3 w-full cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            type="text"
            name="text"
            id="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              setIsEditing(false);
              setNewText(text);
            }}
          >
            Cancelar
          </button>
          <button
            className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              updateMutation.mutate({ id: id, newTitle: newText });
            }}
          >
            Guardar
          </button>
        </>
      )}
    </div>
  );
}
