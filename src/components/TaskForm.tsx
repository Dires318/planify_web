import React from 'react'
import { motion } from 'framer-motion'

interface TaskFormProps {
  onSubmit: (task: {
    title: string
    due_date: string
    is_all_day: boolean
    description?: string
  }) => void
  onCancel: () => void
  initialValues?: {
    title: string
    due_date: string
    is_all_day: boolean
    description?: string
  }
}

export default function TaskForm({ onSubmit, onCancel, initialValues }: TaskFormProps) {
  const [title, setTitle] = React.useState(initialValues?.title || '')
  const [dueDate, setDueDate] = React.useState(initialValues?.due_date || '')
  const [isAllDay, setIsAllDay] = React.useState(initialValues?.is_all_day || false)
  const [description, setDescription] = React.useState(initialValues?.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      due_date: dueDate,
      is_all_day: isAllDay,
      description: description || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          What's your next mission?
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          When is it due?
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type={isAllDay ? 'date' : 'datetime-local'}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">All day</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Add some details (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Add any additional details..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Task
        </motion.button>
      </div>
    </form>
  )
} 