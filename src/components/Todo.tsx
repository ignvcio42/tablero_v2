import React, { useState } from "react";
import { api } from "~/utils/api";
import type { Todo } from "~/types";
import { notifications } from '@mantine/notifications'
import { IconCheck, IconLoader, IconX } from '@tabler/icons-react'
import { Button, Checkbox, Group, TextInput, Modal, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
// Aqui estan los todos para editar y eliminar
type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, description, done } = todo;

  const utils = api.useUtils();

  const [opened, { open, close }] = useDisclosure(false);
  // modal confirmacion para eliminar el todo
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Aqui esta la mutacion para actualizar el todo
  const updateMutation = api.todo.update.useMutation({
    onMutate: (inputEnviado) => {
      close();
      const optimisticUpdate = utils.todo.all.getData();

      // Mostrar notificación de carga
      const id = notifications.show({
        loading: true,
        title: 'Actualizando tarea...',
        message: 'Tu tarea se está actualizando',
        autoClose: false,
        withCloseButton: false,
      });

      if (optimisticUpdate) {
        const todosActualizados = optimisticUpdate.map((todo) => {
          if (todo.id !== inputEnviado.id) {
            return todo;
          }

          return {
            ...todo,
            text: inputEnviado.newTitle,
            description: inputEnviado.description || null,
          };
        });

        utils.todo.all.setData(undefined, todosActualizados);
      }

      return { notificationId: id };
    },
    onSuccess: async (dataDevueltaPorElServidor, variables, context) => {
      // Actualizar notificación a éxito
      notifications.update({
        id: context?.notificationId,
        color: 'teal',
        title: '¡Tarea actualizada!',
        message: 'Tu tarea se ha actualizado exitosamente',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000,
      });
    },
    onError: async (errorDevueltoPorElServidor, variables, context) => {
      // Actualizar notificación a error
      notifications.update({
        id: context?.notificationId,
        color: 'red',
        title: 'Error al actualizar',
        message: errorDevueltoPorElServidor.message || 'Ocurrió un error inesperado',
        icon: <IconX size={18} />,
        loading: false,
        autoClose: 4000,
      });
      await utils.todo.all.invalidate();
    },
    onSettled: () => {
      console.log("onSettled");
    },
  });

  // Aqui esta la mutacion para eliminar el todo
  const deleteMutation = api.todo.delete.useMutation({
    onMutate: (inputEnviado) => {
      const optimisticUpdate = utils.todo.all.getData();
      
      // Mostrar notificación de carga
      const id = notifications.show({
        loading: true,
        title: 'Eliminando tarea...',
        message: 'Tu tarea se está eliminando',
        autoClose: false,
        withCloseButton: false,
      });
      
      if (optimisticUpdate) {
        const todosActualizados = optimisticUpdate.filter((todo) => todo.id !== inputEnviado);
        utils.todo.all.setData(undefined, todosActualizados);
      }
      
      return { notificationId: id };
    },
    onSuccess: (dataDevueltaPorElServidor, variables, context) => {
      // Actualizar notificación a éxito
      notifications.update({
        id: context?.notificationId,
        color: 'teal',
        title: '¡Tarea eliminada!',
        message: 'Tu tarea se ha eliminado exitosamente',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000,
      });
    },
    onError: (errorDevueltoPorElServidor, variables, context) => {
      // Actualizar notificación a error
      notifications.update({
        id: context?.notificationId,
        color: 'red',
        title: 'Error al eliminar',
        message: errorDevueltoPorElServidor.message || 'Ocurrió un error inesperado',
        icon: <IconX size={18} />,
        loading: false,
        autoClose: 4000,
      });
      utils.todo.all.invalidate();
    },
    onSettled: () => {
      console.log("onSettled");
    },
  })

  // Aqui esta la mutacion para toggle el todo
  const toggleMutation = api.todo.toggle.useMutation({
    onMutate: (inputEnviado) => {
      const optimisticUpdate = utils.todo.all.getData();
      
      const id = notifications.show({
        loading: true,
        title: 'Actualizando estado...',
        message: 'El estado de la tarea se está actualizando',
        autoClose: false,
        withCloseButton: false,
      });
      
      if (optimisticUpdate) {
        const todosActualizados = optimisticUpdate.map((todo) => {
          if (todo.id !== inputEnviado.id) {
            return todo;
          }
          return {
            ...todo,
            done: inputEnviado.done,
          };
        });
        utils.todo.all.setData(undefined, todosActualizados);
      }
      
      return { notificationId: id };
    },
    onSuccess: (dataDevueltaPorElServidor, variables, context) => {
      notifications.update({
        id: context?.notificationId,
        color: 'teal',
        title: '¡Estado actualizado!',
        message: 'El estado de la tarea se ha actualizado exitosamente',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 3000,
      });
    },
    onError: (errorDevueltoPorElServidor, variables, context) => {
      notifications.update({
        id: context?.notificationId,
        color: 'red',
        title: 'Error al actualizar',
        message: errorDevueltoPorElServidor.message || 'Ocurrió un error inesperado',
        icon: <IconX size={18} />,
        loading: false,
        autoClose: 4000,
      });
    },
    onSettled: async () => {
      await utils.todo.all.refetch();
    },
  });


  // Aqui esta el formulario para actualizar el todo
  const form = useForm({
    initialValues: {
      text: text,
      description: description || '',
    },
    validate: {
      text: (value) => (value.length < 1 ? 'El título es requerido' : null),
      description: (value) => (value && value.length > 200 ? 'La descripción no puede exceder 200 caracteres' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    updateMutation.mutate({
      id: id,
      newTitle: values.text,
      description: values.description || undefined
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex flex-1 items-center gap-2">
          <input
            placeholder="Input component"
            className="focus:ring-3 h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            type="checkbox"
            name="done"
            id="done"
            checked={done}
            onChange={() => toggleMutation.mutate({ id: id, done: !done })} 
          />
          <div className="flex flex-col">
            <label htmlFor="done" className={"cursor-pointer font-medium"}>
              {text}
            </label>
            {description && (
              <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="filled" color="indigo" radius="lg"
            className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={open}
          >
            Editar
          </Button>
          <Button variant="filled" color="red" radius="lg"
            className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            // onClick={() => {
            //   deleteMutation.mutate(id);
            // }}
            onClick={openDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <Modal opened={opened} onClose={close} title="Editar Tarea" centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Título"
            placeholder="Título de la tarea"
            {...form.getInputProps('text')}
            mb="md"
          />

          <Textarea
            label="Descripción"
            placeholder="Descripción de la tarea (opcional)"
            {...form.getInputProps('description')}
            mb="md"
            minRows={3}
            maxRows={6}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Guardar
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal opened={openedDelete} onClose={closeDelete} title="Eliminar Tarea" centered>
        <p>¿Estás seguro de querer eliminar esta tarea?</p>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={closeDelete}>
            Cancelar
          </Button>
          <Button 
            variant="filled" 
            color="red" 
            onClick={() => {
              deleteMutation.mutate(id);
              closeDelete();
            }}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  );
}
