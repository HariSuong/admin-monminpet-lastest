import InvoiceList from '@/components/invoices/list'
import invoiceApiRequest from '@/services/apiInvoices'
import { cookies } from 'next/headers'
import React from 'react'

const InvoicesPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: invoices } = await invoiceApiRequest.getInvoices(
      sessionToken
    )
    console.log('invoices', invoices)
    return (
      <div>
        <InvoiceList initialInvoices={invoices} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return <div>Error loading invoices</div>
  }
}

export default InvoicesPage
