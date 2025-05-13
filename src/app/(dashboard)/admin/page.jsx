'use client';

import CreateAccount from '@/components/Account';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  return (
    <div>
      {/* <h1 className="text-3xl font-bold">User Dashboard</h1> */}
      <div className="mt-6">
      
       <CreateAccount />
       
      </div>
 
    </div>
  );
}