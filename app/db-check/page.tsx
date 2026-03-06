"use client";

import { useEffect, useState } from "react";

type DbStatus = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  counts?: {
    programs: number;
    studies: number;
    milestones: number;
  };
  error?: string;
};

export default function DbCheckPage() {
  const [result, setResult] = useState<DbStatus>({ status: "idle", message: "" });

  const checkConnection = async () => {
    setResult({ status: "loading", message: "Checking connection..." });

    try {
      const res = await fetch("/api/db-check");
      const data = await res.json();

      setResult({
        status: data.status,
        message: data.message,
        counts: data.counts,
        error: data.error,
      });
    } catch (err) {
      setResult({
        status: "error",
        message: "Failed to reach API",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🔌 Database Connection Check
        </h1>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            result.status === "success"
              ? "bg-green-100 text-green-700"
              : result.status === "error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <span>
            {result.status === "success"
              ? "✅"
              : result.status === "error"
              ? "❌"
              : "⏳"}
          </span>
          {result.message || "Idle"}
        </div>

        {/* Model Counts */}
        {result.counts && (
          <div className="space-y-3 mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Table Record Counts
            </h2>
            {Object.entries(result.counts).map(([model, count]) => (
              <div
                key={model}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
              >
                <span className="capitalize text-gray-700 font-medium">
                  {model}
                </span>
                <span className="text-gray-900 font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {result.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700 break-words">
            {result.error}
          </div>
        )}

        {/* Retry Button */}
        <button
          onClick={checkConnection}
          disabled={result.status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {result.status === "loading" ? "Checking..." : "Re-check Connection"}
        </button>
      </div>
    </div>
  );
}