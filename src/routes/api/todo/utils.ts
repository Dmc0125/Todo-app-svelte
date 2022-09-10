import { z } from 'zod'

type ErrMessages = {
  required_error?: string
  invalid_type_error?: string
}

export const idStrToNumSchema = (errMessages: ErrMessages) =>
  z
    .string({ required_error: errMessages.required_error })
    .regex(/^[1-9][0-9]*/, errMessages.invalid_type_error)
    .transform((id) => Number(id))
