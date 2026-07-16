"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function WelcomeDialog() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      const hasSeenWelcome = localStorage.getItem("twizztools-welcome-seen")
      if (!hasSeenWelcome) {
        setOpen(true)
      }
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [])

  const handleClose = () => {
    localStorage.setItem("twizztools-welcome-seen", "true")
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) handleClose()
    }}>
      <AlertDialogContent size="default" className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">TwizzCutter sekarang pindah ke TwizzTools!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-left text-base leading-relaxed">
            <p>
              Hai semuanya! <span className="font-semibold">twizzcutter.com</span> sekarang sudah selesai dan resmi pindah ke{" "}
              <span className="font-bold text-foreground">twizztools.my.id</span>.
            </p>
            <p>
              Maaf banget kalau selama proses pindahan kemarin ada kendala atau bikin kurang nyaman. Di update{" "}
              <span className="font-bold text-foreground">V3</span> ini, kami lebih fokus ke performa supaya prosesnya makin cepat dan ringan. Semua fitur juga berjalan{" "}
              <span className="font-bold text-foreground">100% client-side</span>, jadi file kamu tidak di-upload ke server.
            </p>
            <p>
              Ke depannya bakal ada lebih banyak update dan fitur baru. Terus dukung kami, ya!
            </p>
            <p className="font-bold text-foreground text-center pt-2">
              Butuh tools? Ingat TwizzTools.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Mengerti</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
