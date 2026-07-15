import { db } from "@/db"
import { footers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

type Params = {
  params: Promise<{
    code: string
  }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { code } = await params

    const [footer] = await db
      .select()
      .from(footers)
      .where(eq(footers.code, code))
      .limit(1)

    if (!footer) {
      return NextResponse.json({ error: "Footer not found" }, { status: 404 })
    }

    return NextResponse.json({ footer })
  } catch (error) {
    console.error("Error fetching footer:", error)
    return NextResponse.json(
      { error: "Failed to fetch footer" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { code } = await params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const [updatedFooter] = await db
      .update(footers)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(footers.code, code))
      .returning()

    if (!updatedFooter) {
      return NextResponse.json({ error: "Footer not found" }, { status: 404 })
    }

    return NextResponse.json({ footer: updatedFooter })
  } catch (error) {
    console.error("Error updating footer:", error)
    return NextResponse.json(
      { error: "Failed to update footer" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { code } = await params

    const [deletedFooter] = await db
      .delete(footers)
      .where(eq(footers.code, code))
      .returning()

    if (!deletedFooter) {
      return NextResponse.json({ error: "Footer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting footer:", error)
    return NextResponse.json(
      { error: "Failed to delete footer" },
      { status: 500 }
    )
  }
}
