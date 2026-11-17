import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({
  open: false,
  setOpen: () => {},
})

const Dialog = ({ children, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (newOpen) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ asChild = false, children, ...props }) => {
  const { setOpen } = React.useContext(DialogContext)

  return React.cloneElement(children, {
    onClick: (e) => {
      children.props?.onClick?.(e)
      setOpen(true)
    },
    ...props,
  })
}

const DialogContent = React.forwardRef(({ className, children, layoutId, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen])

  const content = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Backdrop yang menutupi seluruh layar (termasuk Sidebar dan Navbar) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog Modal Box */}
          <motion.div
            ref={ref}
            layoutId={layoutId}
            initial={layoutId ? undefined : { opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={layoutId ? undefined : { opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-2xl border bg-background p-6 shadow-2xl sm:rounded-2xl",
              className
            )}
            {...props}
          >
            {children}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-sm p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer z-20"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (!mounted || typeof document === "undefined") return null

  // Render modal ke document.body via Portal agar menutupi seluruh layar (termasuk Sidebar & Navbar)
  return createPortal(content, document.body)
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground mt-1.5", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ({ children, ...props }) => {
  const { setOpen } = React.useContext(DialogContext)
  return React.cloneElement(children, {
    onClick: (e) => {
      children.props?.onClick?.(e)
      setOpen(false)
    },
    ...props,
  })
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
