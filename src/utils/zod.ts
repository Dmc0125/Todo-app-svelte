import { z } from 'zod'

export const requiredError = (prop: string) => `${prop} is required.`
export const typeError = (prop: string, type: string) => `${prop} needs to be of type ${type}.`

type ErrMessages = {
  required_error?: string
  invalid_type_error?: string
}

export const idStrToNumSchema = (errMessages: ErrMessages) =>
  z
    .string({ required_error: errMessages.required_error })
    .regex(/^[1-9][0-9]*/, errMessages.invalid_type_error)
    .transform((id) => Number(id))
