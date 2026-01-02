import z from 'zod'

export const LoginRes = z.object({
  token: z.string()
})

export const LoginBody = z
  .object({
    email: z.string().email('Email không đúng định dạng'),
    password: z
      .string()
      // .min(8, 'Mật khẩu có ít nhất 8 ký tự')
      .max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export type LoginResType = z.TypeOf<typeof LoginRes>

export const PasswordResetBody = z
  .object({
    email: z.string().email('Email không đúng định dạng')
  })
  .strict()

export const LogoutRes = z.object({
  message: z.string()
})

export const PassForgotBody = z
  .object({
    email: z.string().email('Email không đúng định dạng')
  })
  .strict()

export const PassForgotRes = z
  .object({
    message: z.string(),
    otp: z.number()
  })
  .strict()

export const ChangePassBody = z
  .object({
    email: z.string().email('Email không đúng định dạng'),
    password: z
      .string()
      // .min(8, 'Mật khẩu có ít nhất 8 ký tự')
      .max(100),
    otp: z.string(),
    confirmPassword: z
      .string()
      // .min(8, 'Mật khẩu có ít nhất 8 ký tự')
      .max(100)
      .optional()
  })
  .strict()

export const ChangePassRes = z
  .object({
    message: z.string()
  })
  .strict()

export const PassResetForm = z.object({
  password: z
    .string()
    // .min(8, 'Mật khẩu có ít nhất 8 ký tự')
    .max(100),
  confirmPassword: z
    .string()
    // .min(8, 'Mật khẩu có ít nhất 8 ký tự')
    .max(100),
  otp: z.string()
})

export type LogoutResType = z.TypeOf<typeof LogoutRes>

export type PasswordResetBodyType = z.TypeOf<typeof PasswordResetBody>

export const PasswordResetRes = LoginRes

export type PasswordResetResType = z.TypeOf<typeof PasswordResetRes>

export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = LoginRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>

export type PassForgotBodyType = z.TypeOf<typeof PassForgotBody>
export type PassForgotResType = z.TypeOf<typeof PassForgotRes>
export type PassResetFormType = z.TypeOf<typeof PassResetForm>
export type ChangePassBodyType = z.TypeOf<typeof ChangePassBody>
export type ChangePassResType = z.TypeOf<typeof ChangePassRes>
