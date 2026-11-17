import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* 2. KPI Stats Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="space-y-2 pt-1">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Two Columns Section (Tasks & Inventory) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Recent Tasks Skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-60 rounded-md" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          <div className="divide-y divide-border">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="py-3.5 px-2 flex items-center justify-between gap-3">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-44 rounded" />
                  </div>
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Quick Inventory Alert Skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-60 rounded-md" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>

          <div className="divide-y divide-border">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="py-3.5 px-2 flex items-center justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <div className="space-y-1.5 text-right shrink-0">
                  <Skeleton className="h-6 w-14 rounded ml-auto" />
                  <Skeleton className="h-3 w-8 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
