import { Breadcrumbs } from '@/components/breadcrumbs'
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'

export default function Index() {

    const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Token Settings', href: '/storeManagement/tokenSettings' },
    ]
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Token Settings" />



    </AppLayout>
  )
}
