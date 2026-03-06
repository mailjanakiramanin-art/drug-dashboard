"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Study {
  id: string
  name: string
  phase: string
  targetEnrollment: number
  currentEnrollment: number
}

interface Milestone {
  id: string
  title: string
  status: string
  targetDate: string
  completedDate?: string
}

interface Program {
  id: string
  name: string
  phase: string
  therapeuticArea: string
  status: string
  description?: string
  studies: Study[]
  milestones: Milestone[]
}

export default function ProgramDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchProgram() {
      try {
        setLoading(true)
        const res = await fetch(`/api/programs/${id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch program: ${res.status}`)
        }
        const data = await res.json()
        setProgram(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchProgram()
  }, [id])

  if (loading) {
    return (
      <div className="bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">Loading program details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">Program not found</div>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{program.name}</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Program Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phase</p>
              <p className="text-lg text-gray-900">{program.phase}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Therapeutic Area</p>
              <p className="text-lg text-gray-900">{program.therapeuticArea}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg text-gray-900">{program.status}</p>
            </div>
            {program.description && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-lg text-gray-900">{program.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Studies</h2>
          {program.studies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Enrollment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Enrollment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {program.studies.map((study) => (
                    <tr key={study.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{study.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{study.phase}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{study.targetEnrollment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{study.currentEnrollment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No studies available.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Milestones</h2>
          {program.milestones.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {program.milestones.map((milestone) => (
                    <tr key={milestone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{milestone.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{milestone.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(milestone.targetDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {milestone.completedDate ? new Date(milestone.completedDate).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No milestones available.</p>
          )}
        </div>
      </div>
    </div>
  )
}