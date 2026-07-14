import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TwizzTools - Free Instagram Tools",
  description: "Koleksi tools gratis untuk membantu workflow kreatif kamu. Image cutter untuk Instagram Grid & Carousel, dan Reels maker.",
  openGraph: {
    title: "TwizzTools - Free Instagram Tools",
    description: "Koleksi tools gratis untuk membantu workflow kreatif kamu. Image cutter untuk Instagram Grid & Carousel, dan Reels maker.",
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">TwizzTools</h1>
        <p className="text-lg text-muted-foreground">
          Koleksi tools untuk membantu workflow kreatif kamu
        </p>
        <div className="grid gap-4 sm:grid-cols-2 mt-8">
          <a
            href="/cutter"
            className="rounded-xl border bg-card p-6 hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Image Cutter</h2>
            <p className="text-sm text-muted-foreground">
              Potong gambar untuk Instagram Grid & Carousel
            </p>
          </a>
          <a
            href="/reels"
            className="rounded-xl border bg-card p-6 hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Reels Maker</h2>
            <p className="text-sm text-muted-foreground">
              Buat gambar format 9:16 untuk Instagram Reels
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
