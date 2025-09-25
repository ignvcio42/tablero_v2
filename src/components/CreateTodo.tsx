import React, { useState } from 'react'
import { api } from '~/utils/api'
import Todo from './Todo'
import { todoInput } from '~/types'
import toast from 'react-hot-toast'

export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState('')

    const utils = api.useContext()

    const { mutate } = api.todo.create.useMutation({
        onMutate: () => {
            // SE ENVIA LA PETICION AL SERVIDOR

        },
        onSuccess: () => {
            setNewTodo('')
            toast.success('Todo created successfully')
        },
        onError: () => {

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

                    const result = todoInput.safeParse(newTodo)

                    if (!result.success) {
                        console.log("Invalid input")
                        toast.error(result.error.errors[0]?.message || "Invalid input")
                        return
                    }
                    //Create Todo mutation
                    mutate(newTodo)

                }}
                className='flex gap-2'>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Add a todo' name='new-todo' id='new-todo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />

                <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Create</button>
            </form>
        </div>
    )
}
