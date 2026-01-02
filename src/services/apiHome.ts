import http from '@/libs/http'
import { DashboardResponseType } from '@/schemaValidations/dashboard.schema'

const dashboardApiRequest = {
  getDashboard: (sessionToken: string = '') =>
    http.get<DashboardResponseType>(`/dashboard`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    })
}

export default dashboardApiRequest
