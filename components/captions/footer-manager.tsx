"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

type Footer = {
  id: number
  code: string
  content: string
}

type FooterManagerProps = {
  open: boolean
  onClose: () => void
}

export function FooterManager({ open, onClose }: FooterManagerProps) {
  const [footers, setFooters] = React.useState<Footer[]>([])
  const [loading, setLoading] = React.useState(false)
  const [editingFooter, setEditingFooter] = React.useState<Footer | null>(null)

  const [newCode, setNewCode] = React.useState("")
  const [newContent, setNewContent] = React.useState("")
  const [importCode, setImportCode] = React.useState("")

  const fetchFooters = React.useCallback(async () => {
    try {
      const response = await fetch("/api/footers")
      const data = await response.json()
      setFooters(data.footers || [])
    } catch (_error) {
      toast.error("Failed to fetch footers")
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      fetchFooters()
    }
  }, [open, fetchFooters])

  const handleCreate = async () => {
    if (!newCode || !newContent) {
      toast.error("Code and content are required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/footers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode,
          content: newContent,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create footer")
      }

      toast.success("Footer created successfully")
      setNewCode("")
      setNewContent("")
      fetchFooters()
    } catch (_error) {
      toast.error(_error instanceof Error ? _error.message : "Failed to create footer")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingFooter) return

    setLoading(true)
    try {
      const response = await fetch(`/api/footers/${editingFooter.code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editingFooter.content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update footer")
      }

      toast.success("Footer updated successfully")
      setEditingFooter(null)
      fetchFooters()
    } catch (_error) {
      toast.error("Failed to update footer")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this footer?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/footers/${code}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete footer")
      }

      toast.success("Footer deleted successfully")
      fetchFooters()
    } catch (_error) {
      toast.error("Failed to delete footer")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!importCode.trim()) {
      toast.error("Please enter a footer code")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/footers/${importCode.trim()}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Footer code not found")
        }
        throw new Error("Failed to import footer")
      }

      const data = await response.json()
      
      const alreadyExists = footers.some(f => f.code === data.footer.code)
      if (alreadyExists) {
        toast.error("Footer already exists in your list")
        setImportCode("")
        return
      }

      toast.success(`Footer "${data.footer.code}" imported successfully`)
      setImportCode("")
      fetchFooters()
    } catch (_error) {
      toast.error(_error instanceof Error ? _error.message : "Failed to import footer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-[600px] w-[700px] max-w-[90vw] flex flex-col p-0">
        <div className="px-6 pt-6 pb-0">
          <DialogHeader className="space-y-1">
            <DialogTitle>Footer Manager</DialogTitle>
            <DialogDescription>
              Create and manage reusable footer templates for your captions
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="create" className="flex-1 flex flex-col min-h-0">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="manage">Manage Existing</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="h-px bg-border my-4" />

          <TabsContent value="create" className="flex-1 flex flex-col min-h-0 mt-0">
            <div className="flex-1 overflow-auto space-y-4 px-6">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g. twizztools"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this footer
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="e.g. ✨ Made with TwizzTools&#10;🔗 twizztools.com&#10;&#10;#Kabinetxxx #Himaxxx #Universitasxxx"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="border-t p-4 px-6">
              <Button onClick={handleCreate} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Footer"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="flex-1 overflow-auto mt-0 px-6 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-code">Import Footer by Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="import-code"
                    placeholder="Enter footer code to import"
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleImport()
                      }
                    }}
                  />
                  <Button onClick={handleImport} disabled={loading || !importCode.trim()}>
                    Import
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Import an existing footer created by others using its code
                </p>
              </div>

              {footers.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No footers yet. Create one or import existing footer.
                </div>
              ) : (
                <div className="space-y-3 pr-2">
                {footers.map((footer) => (
                  <div
                    key={footer.id}
                    className="rounded-lg border bg-card p-4 space-y-3"
                  >
                    {editingFooter?.id === footer.id ? (
                      <>
                        <div className="space-y-2">
                          <Label>Code *</Label>
                          <Input
                            value={editingFooter.code}
                            onChange={(e) =>
                              setEditingFooter({
                                ...editingFooter,
                                code: e.target.value,
                              })
                            }
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Code cannot be changed after creation
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={editingFooter.content}
                            onChange={(e) =>
                              setEditingFooter({
                                ...editingFooter,
                                content: e.target.value,
                              })
                            }
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdate}
                            disabled={loading}
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingFooter(null)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{footer.code}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                              onClick={() => setEditingFooter(footer)}
                            >
                              <HugeiconsIcon
                                icon={PencilEdit02Icon}
                                strokeWidth={2}
                                className="size-4"
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 text-destructive"
                              onClick={() => handleDelete(footer.code)}
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                strokeWidth={2}
                                className="size-4"
                              />
                            </Button>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap rounded bg-muted p-2 text-xs">
                          {footer.content}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
