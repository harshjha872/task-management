import { z } from 'zod'

export const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  dueDate: z.string().min(1, "Due date is required"),
  taskCategory: z.enum(["work", "personal"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  taskStatus: z.enum(["todo", "inprogress", "completed"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
})

export type TaskFormData = z.infer<typeof taskSchema>
