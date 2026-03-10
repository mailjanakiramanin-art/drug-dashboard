"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/app/lib/AuthContext"
import { useRouter } from "next/navigation"

type SortField = "name" | "phase" | "therapeuticArea"
type SortOrder = "asc" | "desc"

interface Program {
  id: string
  name: string
  phase: string
  therapeuticArea: string
  status: string
  description?: string
}

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [editFormData, setEditFormData] = useState<Program | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const itemsPerPage = 10

  useEffect(() => {
    fetch("/api/programs")
      .then(res => res.json())
      .then(data => setPrograms(data))
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleEditClose()
    }

    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [])

  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingProgram) {
      firstInputRef.current?.focus()
    }
  }, [editingProgram])

  const canEdit = user && (user.role === "EDITOR" || user.role === "ADMIN")

  // Filter programs based on search query
  const filteredPrograms = programs.filter((program: any) =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.therapeuticArea.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort programs
  const sortedPrograms = [...filteredPrograms].sort((a: any, b: any) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1
    }
    return 0
  })

  // Paginate programs
  const totalPages = Math.ceil(sortedPrograms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPrograms = sortedPrograms.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleEditClick = (program: Program) => {
    setEditingProgram(program)
    setEditFormData({ ...program })
    setEditError("")
  }

  const handleEditClose = () => {
    setEditingProgram(null)
    setEditFormData(null)
    setEditError("")
  }

  const handleEditSave = async () => {
    if (!editFormData) return

    setEditLoading(true)
    setEditError("")

    try {
      const response = await fetch(`/api/programs/${editFormData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update program")
      }

      const updatedProgram = await response.json()
      setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p))
      handleEditClose()
    } catch (error: any) {
      setEditError(error.message || "Failed to update program")
    } finally {
      setEditLoading(false)
    }
  }

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortField === field
    const indicator = isActive ? (sortOrder === "asc" ? " ↑" : " ↓") : ""

    return (
      <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      >
        <button
          onClick={() => handleSort(field)}
          className="flex items-center gap-1"
          aria-sort={
            isActive
              ? sortOrder === "asc"
                ? "ascending"
                : "descending"
              : "none"
          }
        >
          {label}
          <span aria-hidden="true">{indicator}</span>
        </button>
      </th>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div role="status" aria-live="polite" className="text-gray-800">Loading programs...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-800 text-lg">
          You must be signed in to view the program dashboard.
        </p>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  return (

    <div className="bg-gray-50">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">

          {/* Search Bar */}
          <div className="mb-6">
            <label htmlFor="program-search" className="sr-only">Search programs by name, phase, or therapeutic area</label>
            <input
              id="table-search"
              type="text"
              placeholder="Search by name, phase, or therapeutic area..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results info */}
          <div aria-live="polite" className="mb-4 text-sm text-gray-800">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPrograms.length)} of {sortedPrograms.length} results
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">

            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">List of clinical programs with name, phase, and therapeutic area</caption>

              <thead className="bg-gray-50">

                <tr>

                  <SortableHeader field="name" label="Name" />

                  <SortableHeader field="phase" label="Phase" />

                  <SortableHeader field="therapeuticArea" label="Therapeutic Area" />

                  {canEdit && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>

              <tbody className="bg-white divide-y divide-gray-200">

                {paginatedPrograms.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/dashboard/${p.id}`} className="hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {p.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.phase}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.therapeuticArea}
                    </td>

                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          aria-label={`Edit program ${p.name}`}
                          onClick={() => handleEditClick(p)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    )}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination Controls */}
          <nav
            className="mt-6 flex items-center justify-between"
            aria-label="Program table pagination"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-sm text-gray-800">
              Page {currentPage} of {totalPages || 1}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>

        </div>
      </div>

      {/* Edit Modal */}
      {editingProgram && editFormData && (
        <div role="dialog"
          aria-modal="true"
          aria-labelledby="edit-program-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 id="edit-program-title" className="text-2xl font-bold text-gray-900 mb-4">
              Edit Program
            </h2>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm rounded">
                {editError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phase
                </label>
                <input
                  type="text"
                  value={editFormData.phase}
                  onChange={(e) => setEditFormData({ ...editFormData, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Therapeutic Area
                </label>
                <input
                  type="text"
                  value={editFormData.therapeuticArea}
                  onChange={(e) => setEditFormData({ ...editFormData, therapeuticArea: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.description || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleEditClose}
                disabled={editLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  )

}