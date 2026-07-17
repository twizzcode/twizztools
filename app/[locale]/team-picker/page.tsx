"use client"

import * as React from "react"
import { CrownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Mode = "teams" | "members"

type Team = {
  name: string
  members: string[]
  leader?: string
}

const STORAGE_KEY = "twizztools-team-picker"

type StoredState = {
  rawNames: string
  mode: Mode
  amount: number
  withLeader: boolean
}

function getStoredState(): StoredState {
  if (typeof window === "undefined") return { rawNames: "", mode: "teams", amount: 2, withLeader: true }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return { rawNames: "", mode: "teams", amount: 2, withLeader: true }
    const parsed = JSON.parse(value) as Partial<StoredState>

    return {
      rawNames: typeof parsed.rawNames === "string" ? parsed.rawNames : "",
      mode: parsed.mode === "members" ? "members" : "teams",
      amount: typeof parsed.amount === "number" && Number.isFinite(parsed.amount) ? parsed.amount : 2,
      withLeader: typeof parsed.withLeader === "boolean" ? parsed.withLeader : true,
    }
  } catch {
    return { rawNames: "", mode: "teams", amount: 2, withLeader: true }
  }
}

function getNames(value: string) {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
}

function getDuplicateNames(names: string[]) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const name of names) {
    const key = name.toLowerCase()
    if (seen.has(key)) duplicates.add(name)
    seen.add(key)
  }

  return [...duplicates]
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function splitTeams(names: string[], mode: Mode, amount: number, withLeader: boolean, teamLabel: string) {
  const safeAmount = Math.max(1, Math.floor(amount))
  const teamCount = mode === "teams" ? Math.min(safeAmount, names.length) : Math.ceil(names.length / safeAmount)
  const teams = Array.from({ length: teamCount }, (_, index) => ({
    name: `${teamLabel} ${index + 1}`,
    members: [] as string[],
  }))

  shuffle(names).forEach((name, index) => {
    teams[index % teamCount].members.push(name)
  })

  return teams.map((team) => ({
    ...team,
    leader: withLeader && team.members.length ? shuffle(team.members)[0] : undefined,
  }))
}

function download(url: string, name: string) {
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
}

export default function TeamPickerPage() {
  const t = useTranslations('teamPicker');
  const [initialState] = React.useState(getStoredState)
  const [rawNames, setRawNames] = React.useState(initialState.rawNames)
  const [mode, setMode] = React.useState<Mode>(initialState.mode)
  const [amount, setAmount] = React.useState(initialState.amount)
  const [withLeader, setWithLeader] = React.useState(initialState.withLeader)
  const [teams, setTeams] = React.useState<Team[]>([])
  const [isShuffling, setIsShuffling] = React.useState(false)
  const pageRef = React.useRef<HTMLElement | null>(null)
  const resultsRef = React.useRef<HTMLElement | null>(null)
  const namesId = React.useId()
  const amountId = React.useId()
  const leaderId = React.useId()

  const names = React.useMemo(() => getNames(rawNames), [rawNames])

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ rawNames, mode, amount, withLeader }))
  }, [amount, mode, rawNames, withLeader])

  const restart = React.useCallback(() => {
    setRawNames("")
    setMode("teams")
    setAmount(2)
    setWithLeader(true)
    setTeams([])
    setIsShuffling(false)
    window.setTimeout(() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0)
  }, [])

  const randomize = React.useCallback(() => {
    if (names.length < 2) {
      toast.error(t('errors.minNames'))
      return
    }

    const duplicates = getDuplicateNames(names)
    if (duplicates.length) {
      toast.error(t('errors.duplicateNames', { names: duplicates.join(", ") }))
      return
    }

    if (!Number.isInteger(amount) || amount < 1) {
      toast.error(t('errors.invalidAmount'))
      return
    }

    if (amount > names.length) {
      toast.error(mode === "teams" ? t('errors.teamsExceed') : t('errors.membersExceed'))
      return
    }

    setTeams(splitTeams(names, mode, amount, withLeader, t('team')))
    setIsShuffling(true)
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)

    let tick = 0
    const timer = window.setInterval(() => {
      setTeams(splitTeams(names, mode, amount, withLeader, t('team')))
      tick += 1

      if (tick >= 20) {
        window.clearInterval(timer)
        setTeams(splitTeams(names, mode, amount, withLeader, t('team')))
        setIsShuffling(false)
      }
    }, 200)
  }, [amount, mode, names, withLeader, t])

  const exportImage = React.useCallback(async () => {
    if (!teams.length) return

    const peopleLabel = t('people')
    const columns = Math.min(2, teams.length)
    const cardWidth = 360
    const cardGap = 24
    const padding = 32
    const lineHeight = 34
    const cardHeights = teams.map((team) => 86 + team.members.length * lineHeight)
    const rows = Math.ceil(teams.length / columns)
    const rowHeights = Array.from({ length: rows }, (_, row) => Math.max(...cardHeights.slice(row * columns, row * columns + columns)))
    const width = padding * 2 + columns * cardWidth + (columns - 1) * cardGap
    const height = padding * 2 + rowHeights.reduce((total, value) => total + value, 0) + (rows - 1) * cardGap
    const canvas = document.createElement("canvas")
    canvas.width = width * 2
    canvas.height = height * 2
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.scale(2, 2)
    ctx.fillStyle = "#111318"
    ctx.fillRect(0, 0, width, height)
    ctx.font = "14px sans-serif"

    teams.forEach((team, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const x = padding + column * (cardWidth + cardGap)
      const y = padding + rowHeights.slice(0, row).reduce((total, value) => total + value, 0) + row * cardGap
      const cardHeight = cardHeights[index]

      ctx.fillStyle = "#171a21"
      ctx.strokeStyle = "#2b313c"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(x, y, cardWidth, cardHeight, 18)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#f4f7fb"
      ctx.font = "700 18px sans-serif"
      ctx.fillText(team.name, x + 24, y + 36)
      ctx.fillStyle = "#9aa3b2"
      ctx.font = "13px sans-serif"
      ctx.fillText(`${team.members.length} ${peopleLabel}`, x + cardWidth - 88, y + 36)

      team.members.forEach((member, memberIndex) => {
        const itemY = y + 70 + memberIndex * lineHeight
        const isLeader = member === team.leader

        if (isLeader) {
          ctx.fillStyle = "#29476f"
          ctx.beginPath()
          ctx.roundRect(x + 20, itemY - 20, cardWidth - 40, 28, 8)
          ctx.fill()
        }

        ctx.fillStyle = isLeader ? "#6da7ff" : "#f4f7fb"
        ctx.font = isLeader ? "700 15px sans-serif" : "15px sans-serif"
        ctx.fillText(member, x + 32, itemY)
        if (isLeader) ctx.fillText("♛", x + cardWidth - 48, itemY)
      })
    })

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
    if (!blob) return
    const url = URL.createObjectURL(blob)
    download(url, "team-picker.png")
    URL.revokeObjectURL(url)
  }, [teams, t])

  return (
    <main ref={pageRef} className="container mx-auto flex h-full min-h-0 flex-1 overflow-auto pt-4 pb-8 lg:overflow-hidden lg:py-0">
      <div className="grid min-h-fit flex-1 gap-4 overflow-visible px-4 pb-4 lg:min-h-0 lg:overflow-hidden lg:py-4 lg:grid-cols-[360px_1fr]">
        <section className="flex flex-col rounded-xl border bg-card p-4 lg:min-h-0">
          <div className="space-y-4 pb-4 lg:min-h-0 lg:flex-1 lg:overflow-auto">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
              </div>
              <Separator className="-mx-4 w-auto" />
            </div>

          <div>
            <label htmlFor={namesId} className="mb-2 block text-sm font-medium">{t('memberNames')}</label>
            <Textarea
              id={namesId}
              value={rawNames}
              onChange={(event) => setRawNames(event.target.value)}
              className="min-h-64 resize-none"
              placeholder={t('placeholder')}
            />
            <p className="mt-2 text-xs text-muted-foreground">{names.length} {t('validNames')}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('method')}</label>
            <ToggleGroup
              value={[mode]}
              onValueChange={(value) => {
                const selected = value[0]
                if (selected) setMode(selected as Mode)
              }}
              className="grid w-full grid-cols-2"
              variant="outline"
              spacing={0}
            >
              <ToggleGroupItem value="teams" className="h-auto w-full px-3 py-2 text-wrap">
                {t('numberOfTeams')}
              </ToggleGroupItem>
              <ToggleGroupItem value="members" className="h-auto w-full px-3 py-2 text-wrap">
                {t('membersPerTeam')}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <label htmlFor={amountId} className="text-sm font-medium">{t('amount')}</label>
            <Input
              id={amountId}
              type="number"
              min={1}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>

          <label htmlFor={leaderId} className="flex items-center gap-3 text-sm">
            <Switch id={leaderId} checked={withLeader} onCheckedChange={setWithLeader} />
            {t('randomLeader')}
          </label>

          </div>

          <div className="grid shrink-0 gap-2 pt-4 sm:grid-cols-3 lg:grid-cols-1">
            <Button onClick={randomize} disabled={isShuffling} data-umami-event="team_picker_randomize">
              {isShuffling ? t('shuffling') : t('randomizeTeam')}
            </Button>
            <Button variant="outline" onClick={restart} disabled={isShuffling}>{t('restart')}</Button>
            <Button variant="outline" onClick={exportImage} disabled={!teams.length || isShuffling}>{t('exportImage')}</Button>
          </div>
        </section>

        <section ref={resultsRef} className={`${teams.length || isShuffling ? "block" : "hidden"} rounded-xl border bg-muted/30 p-4 lg:block lg:min-h-0 lg:overflow-auto`}>
          {teams.length === 0 ? (
            <div className="flex h-full min-h-[320px] items-center justify-center text-center text-sm text-muted-foreground">
              {t('resultsPlaceholder')}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team) => (
              <article
                key={team.name}
                className={`rounded-xl border bg-card p-4 shadow-sm transition-colors duration-300 ${isShuffling ? "border-primary/50" : ""}`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-semibold">{team.name}</h2>
                  <span className="text-xs text-muted-foreground">{team.members.length} {t('people')}</span>
                </div>

                <div className="space-y-2">
                  {team.members.map((member) => {
                    const isLeader = member === team.leader

                    return (
                      <div
                        key={`${team.name}-${member}`}
                        className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-300 ${isLeader ? "bg-primary/15 font-semibold text-primary" : "bg-muted/60"}`}
                      >
                        <span className="truncate">{member}</span>
                        {isLeader ? <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-4 shrink-0" /> : null}
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
