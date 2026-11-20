import React from "react"
import { cn } from "@/lib/utils"

/**
 * Komponen PageHeader reusable untuk judul halaman, deskripsi, dan tombol aksi
 */
export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  children,
  className,
  bordered = true,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        bordered ? "pb-6 mb-6 border-b" : "pb-0 mb-0 border-b-0",
        className
      )}
    >
      <div className="space-y-1">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:underline hover:text-foreground transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  )
}
