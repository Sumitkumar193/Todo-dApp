import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTodoMutation } from '../api/api'
import toast from 'react-hot-toast'

interface NewTodoModalProps {
  isOpen: boolean
  onClose: () => void
}

const todoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
})

type TodoFormValues = z.infer<typeof todoSchema>

export default function CreateTodoModal({ isOpen, onClose }: NewTodoModalProps) {
    const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
  })

  const TodoMutation = useMutation({
    mutationFn: createTodoMutation,
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
      toast.success('Todo created successfully')
    },
  })

  const handleFormSubmit: SubmitHandler<TodoFormValues> = (data) => {
    TodoMutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">New Todo</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            ></textarea>
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}