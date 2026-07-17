"use client"

import * as React from "react"

export function WelcomeDialogLoader() {
  const [Dialog, setDialog] = React.useState<React.ComponentType | null>(null)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (localStorage.getItem("twizztools-welcome-seen")) {
        return
      }

      import("@/components/welcome-dialog").then((mod) => {
        setDialog(() => mod.WelcomeDialog)
      })
    }, 1500)

    return () => window.clearTimeout(timeout)
  }, [])

  return Dialog ? <Dialog /> : null
}
