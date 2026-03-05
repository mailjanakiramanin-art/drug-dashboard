"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard(){

  const [programs,setPrograms] = useState([])

  useEffect(()=>{

    fetch("/api/programs")
      .then(res=> res.json())
      .then(data=>setPrograms(data))

  },[])

  return(

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Drug Development Portfolio
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phase
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Therapeutic Area
                </th>

              </tr>

            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {programs.map((p:any)=>(
                <tr key={p.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <Link href={`/dashboard/${p.id}`} className="hover:text-blue-800">
                      {p.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.phase}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.therapeuticArea}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}