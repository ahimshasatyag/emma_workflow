import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
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
      </div>

      {/* 2. Tabs Bar Skeleton */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-border bg-card shadow-xs">
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* 3. Settings Form Cards Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="space-y-2 pb-3 border-b border-border">
          <Skeleton className="h-6 w-52 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>

        <div className="pt-2 flex justify-end">
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>
    </motion.div>
  )
}
