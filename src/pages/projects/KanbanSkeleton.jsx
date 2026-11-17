import React from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function KanbanSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* 2. Filter Toolbar Skeleton: Search, Dropdown Divisi, & Filter Prioritas */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-xs">
        {/* Left: Search Bar & Dropdown Divisi */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Bar Skeleton */}
          <Skeleton className="h-9 w-full sm:w-64 rounded-lg" />
          {/* Dropdown Divisi Skeleton */}
          <Skeleton className="h-9 w-full sm:w-52 rounded-lg" />
        </div>

        {/* Right: Priority Filter Pills Skeleton */}
        <div className="flex items-center gap-1.5 flex-wrap self-start lg:self-auto">
          <Skeleton className="h-4 w-14 rounded" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-md" />
          ))}
        </div>
      </div>

      {/* 3. 4 Kanban Columns Skeleton (Matching BoardView Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {[
          { labelWidth: "w-16", count: 2 },
          { labelWidth: "w-24", count: 2 },
          { labelWidth: "w-20", count: 1 },
          { labelWidth: "w-16", count: 1 },
        ].map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col rounded-xl border border-border bg-muted/30 p-3 min-h-[500px]"
          >
            {/* Column Header Skeleton */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5 mb-3 border border-border/60 bg-muted/50">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className={`h-4 ${col.labelWidth} rounded-md`} />
                <Skeleton className="h-4 w-5 rounded-full" />
              </div>
              <Skeleton className="h-5 w-5 rounded" />
            </div>

            {/* Column Task Cards Skeleton */}
            <div className="flex flex-col gap-3 flex-1">
              {[...Array(col.count)].map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs space-y-3"
                >
                  {/* Top Header: ID, Divisi Badge & Priority Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3.5 w-14 rounded" />
                      <Skeleton className="h-3.5 w-12 rounded" />
                    </div>
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-5/6 rounded" />
                    <Skeleton className="h-3.5 w-full rounded" />
                  </div>

                  {/* Ditugaskan oleh (Supervisor Info) */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-2.5 w-32 rounded" />
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5">
                    <Skeleton className="h-4 w-14 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>

                  {/* Card Footer: Stacked Avatars & Due Date / Comment Counter */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                    {/* Stacked Avatars */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center -space-x-1.5">
                        <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
                        <Skeleton className="h-6 w-6 rounded-full ring-2 ring-background" />
                      </div>
                      <Skeleton className="h-3 w-12 rounded" />
                    </div>

                    {/* Due Date & Comments */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-8 rounded" />
                      <Skeleton className="h-3 w-14 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
