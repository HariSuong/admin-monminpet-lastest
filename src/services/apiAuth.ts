import http from '@/libs/http'
import {
  ChangePassBodyType,
  ChangePassResType,
  LoginBodyType,
  LoginResType,
  LogoutResType,
  PassForgotBodyType,
  PassForgotResType
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('/login', body),
  auth: (body: { sessionToken: string }) =>
    http.post('api/auth', body, {
      baseUrl: ''
    }),
  passForgot: (body: PassForgotBodyType) =>
    http.post<PassForgotResType>('/password/forgot', body),
  newPass: (body: ChangePassBodyType) =>
    http.post<ChangePassResType>('/password/reset', body),
  logoutFrNextServerToServer: (sessionToken: string) =>
    http.post<LogoutResType>(
      '/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    ),
  logoutFrClientToNextServer: () =>
    http.post(
      '/api/auth/logout',
      {},
      {
        baseUrl: '',
        cache: 'no-store'
      }
    )
}

export default authApiRequest
