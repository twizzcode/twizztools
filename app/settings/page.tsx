import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - TwizzTools",
  description: "Pengaturan TwizzTools.",
}

const settingSections = [
  {
    title: "Account",
    description: "Profile, preferences, dan akses akun.",
    status: "Coming soon",
  },
  {
    title: "Appearance",
    description: "Theme, layout, dan preferensi tampilan.",
    status: "Coming soon",
  },
  {
    title: "API & Integrations",
    description: "Kelola koneksi layanan eksternal dan token.",
    status: "Coming soon",
  },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman dummy. Struktur siap, fitur belum hidup.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-border/60 bg-muted/30 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium">{section.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {section.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
