const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatChangelogDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}
