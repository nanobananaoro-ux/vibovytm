import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2h5dmJxZWd6b2pxZmFkcWZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTcwNzU4NiwiZXhwIjoyMTExMjgzNTg2fQ.n0HvSy0wEH98sNwm4xoATMuObXDS7GfiPzNP69KnhJc"

async function getSupabase() {
  return createClient()
}

function applyFilters(query: any, searchParams: URLSearchParams): any {
  let q = query

  const select = searchParams.get("select")
  if (select) {
    q = q.select(select)
  } else {
    q = q.select("*")
  }

  const order = searchParams.get("order")
  if (order) {
    const [col, dir] = order.split(".")
    q = q.order(col, { ascending: dir !== "desc" })
  }

  const limit = searchParams.get("limit")
  if (limit) q = q.limit(parseInt(limit))

  for (const [key, value] of searchParams.entries()) {
    if (["select", "order", "limit"].includes(key)) continue
    if (key.startsWith("eq.")) {
      q = q.eq(key.replace("eq.", ""), value)
    } else if (key.startsWith("neq.")) {
      q = q.neq(key.replace("neq.", ""), value)
    } else if (key.startsWith("ilike.")) {
      q = q.ilike(key.replace("ilike.", ""), `%${value}%`)
    } else if (key.startsWith("in.")) {
      q = q.in(key.replace("in.", ""), value.split(","))
    }
  }

  return q
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const supabase = await getSupabase()
    const { path } = await context.params
    const { searchParams } = new URL(request.url)
    const table = path.join("/")

    let query = supabase.from(table)
    query = applyFilters(query, searchParams)

    const { data, error } = await (query as any)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const supabase = await getSupabase()
    const { path } = await context.params
    const table = path.join("/")
    const body = await request.json()

    const { data, error } = await supabase.from(table).insert(body).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const supabase = await getSupabase()
    const { path } = await context.params
    const { searchParams } = new URL(request.url)
    const table = path.join("/")
    const body = await request.json()

    const id = searchParams.get("id")
    const matchCol = searchParams.get("match") || "id"
    const matchVal = id || searchParams.get("value")

    let query = supabase.from(table).update(body)

    if (matchVal) {
      query = query.eq(matchCol, matchVal)
    } else {
      return NextResponse.json(
        { error: "Missing id or value parameter" },
        { status: 400 }
      )
    }

    const { data, error } = await query.select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const supabase = await getSupabase()
    const { path } = await context.params
    const { searchParams } = new URL(request.url)
    const table = path.join("/")
    const id = searchParams.get("id")
    const matchCol = searchParams.get("match") || "id"

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    const { error } = await supabase.from(table).delete().eq(matchCol, id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}