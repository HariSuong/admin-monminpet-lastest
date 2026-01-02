// src/services/apiPosts.js

import http from '@/libs/http'
import {
  InvoiceListPag,
  UpdateInvoiceResType
} from '@/schemaValidations/invoice.schema'

const invoiceApiRequest = {
  getInvoices: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<InvoiceListPag>(
      `/invoices?page=${page}&perPage=${per_page}${id ? `&id=${id}` : ''}
      `,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  // getInvoice: (id: number) => http.get<InvoiceListPag>(`/invoices?id=${id}`),

  updateInvoice: (id: number, body: UpdateInvoiceResType) =>
    http.post<UpdateInvoiceResType>(`/invoices/update/${id}`, body)
}

export default invoiceApiRequest
