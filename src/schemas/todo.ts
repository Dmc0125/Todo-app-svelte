import { z } from 'zod'

import { idStrToNumSchema, requiredError, typeError } from '$lib/utils/zod'
import { groupId } from './group'

export const todoSchema = z.object({
  title: z
    .string({
      required_error: requiredError('title'),
      invalid_type_error: typeError('title', 'string'),
    })
    .max(100)
    .min(1),
  content: z
    .string({
      required_error: requiredError('content'),
      invalid_type_error: typeError('content', 'string'),
    })
    .max(500)
    .min(1),
  groupId,
})

export const todoId = idStrToNumSchema({
  invalid_type_error: typeError('todoId', 'number'),
})
