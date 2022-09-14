import { z } from 'zod'

import { idStrToNumSchema, requiredError, typeError } from '$lib/utils/zod'

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

const groupIdErrorMessages = {
  required_error: requiredError('groupId'),
  invalid_type_error: typeError('groupId', 'number'),
}

export const groupId = idStrToNumSchema(groupIdErrorMessages).or(
  z.number(groupIdErrorMessages).min(1),
)
