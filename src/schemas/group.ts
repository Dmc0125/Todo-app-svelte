import { z } from 'zod'

import { requiredError, typeError } from '$lib/utils/zod'

export const groupSchema = z.object({
  name: z
    .string({
      required_error: requiredError('name'),
      invalid_type_error: typeError('name', 'string'),
    })
    .min(1)
    .max(100),
  description: z
    .string({
      invalid_type_error: typeError('description', 'string'),
    })
    .max(300)
    .default(''),
})
