import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function AccountSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Profile Summary Card Skeleton */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
          <div className="flex flex-col items-center text-center space-y-3">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-1.5 w-full flex flex-col items-center">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3.5 w-28 rounded-md" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3.5 w-28 rounded" />
            </div>
          </div>

          <Skeleton className="h-9 w-full rounded-xl mt-2" />
        </div>

        {/* Right Column: Settings Tabs & Form Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Bar Skeleton */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card shadow-xs">
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>

          {/* Form Card Skeleton */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
            <div className="space-y-1.5 pb-2 border-b border-border">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-3.5 w-72 rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>

            <div className="pt-2 flex justify-end">
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
