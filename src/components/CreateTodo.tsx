import React, { useState } from 'react'
import { api } from '~/utils/api'
import Todo from './Todo'
import { todoInput } from '~/types'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Button } from '@mantine/core'

export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState('')
    const [newDescription, setNewDescription] = useState('')

    const utils = api.useContext()

    const { mutate } = api.todo.create.useMutation({
        onMutate: () => {
            // Mostrar notificación de carga
            const id = notifications.show({
                loading: true,
                title: 'Creando tarea...',
                message: 'Tu nueva tarea se está creando',
                autoClose: false,
                withCloseButton: false,
            });
            
            return { notificationId: id };
        },
        onSuccess: (data, variables, context) => {
            setNewTodo('')
            setNewDescription('')
            
            // Actualizar notificación a éxito
            notifications.update({
                id: context?.notificationId,
                color: 'teal',
                title: '¡Tarea creada!',
                message: 'Tu nueva tarea se ha creado exitosamente',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 3000,
            });
        },
        onError: (error, variables, context) => {
            // Actualizar notificación a error
            notifications.update({
                id: context?.notificationId,
                color: 'red',
                title: 'Error al crear tarea',
                message: error.message || 'Ocurrió un error inesperado',
                icon: <IconX size={18} />,
                loading: false,
                autoClose: 4000,
            });
        },

        onSettled: async () => {
            await utils.todo.all.refetch()
        }
    })
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()

                    const result = todoInput.safeParse({
                        text: newTodo,
                        description: newDescription || undefined
                    })

                    if (!result.success) {
                        console.log("Invalid input")
                        notifications.show({
                            color: 'red',
                            title: 'Error de validación',
                            message: result.error.errors[0]?.message || "Entrada inválida",
                            icon: <IconX size={18} />,
                            autoClose: 3000,
                        });
                        return
                    }
                    //Create Todo mutation
                    mutate({
                        text: newTodo,
                        description: newDescription || undefined
                    })

                }}
                className='flex flex-col gap-3'>
                <div className='flex gap-2'>
                    <input 
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                        placeholder='Título de la tarea' 
                        name='new-todo' 
                        id='new-todo' 
                        value={newTodo} 
                        onChange={(e) => setNewTodo(e.target.value)} 
                    />
                </div>
                <textarea 
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                    placeholder='Descripción (opcional)' 
                    name='new-description' 
                    id='new-description' 
                    value={newDescription} 
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                />
                    <Button 
                        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                        type='submit'
                    >
                        Crear
                    </Button>
            </form>
        </div>
    )
}
