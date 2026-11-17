import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function WarehouseSkeleton() {
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

      {/* 2. Grid (Scanner & Inventory Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Barcode Scanner Skeleton */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3.5 w-60 rounded-md" />
          </div>

          {/* Viewfinder Camera Box */}
          <div className="relative h-48 w-full rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-border/80 flex items-center justify-center overflow-hidden">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="absolute inset-x-8 top-1/2 h-0.5 bg-primary/40 animate-pulse" />
          </div>

          {/* Form Inputs Skeleton */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20 rounded" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-2" />
          </div>
        </div>

        {/* Right Column: Inventory Table Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Skeleton className="h-9 w-full sm:w-64 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          {/* Table Container Skeleton */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/40 border-b border-border">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded ml-auto" />
            </div>

            {/* Table Rows (6 Rows) */}
            <div className="divide-y divide-border">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-4 py-3.5 items-center">
                  <Skeleton className="h-4 w-20 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-14 rounded" />
                    <Skeleton className="h-3 w-10 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Table Pagination Skeleton */}
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-36 rounded" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
