import { db } from "@/db"
import { footers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const allFooters = await db.select().from(footers).orderBy(footers.createdAt)

    return NextResponse.json({ footers: allFooters })
  } catch (error) {
    console.error("Error fetching footers:", error)
    return NextResponse.json(
      { error: "Failed to fetch footers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, content } = body

    if (!code || !content) {
      return NextResponse.json(
        { error: "Code and content are required" },
        { status: 400 }
      )
    }

    const existing = await db
      .select()
      .from(footers)
      .where(eq(footers.code, code))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Footer code already exists" },
        { status: 409 }
      )
    }

    const [newFooter] = await db
      .insert(footers)
      .values({
        code,
        content,
      })
      .returning()

    return NextResponse.json({ footer: newFooter }, { status: 201 })
  } catch (error) {
    console.error("Error creating footer:", error)
    return NextResponse.json(
      { error: "Failed to create footer" },
      { status: 500 }
    )
  }
}
