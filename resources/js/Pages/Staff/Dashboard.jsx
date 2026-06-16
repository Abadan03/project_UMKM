import { Link } from '@inertiajs/react'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
      INI DASHBOARD
      <Link href="/logout" method="post" as="button" className="btn-logout">
        Logout
      </Link>
    </div>
  )
}

export default Dashboard
