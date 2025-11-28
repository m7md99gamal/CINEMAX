import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const apiKey = "9905a53586e4fbd03243b64e152b9691"

  if (!apiKey) {
    return NextResponse.json({ error: "TMDb API key is not configured" }, { status: 500 })
  }

  try {
    // Fetch movie details and credits in parallel
    const [movieRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
    ])

    if (!movieRes.ok || !creditsRes.ok) {
      throw new Error("Failed to fetch movie details")
    }

    const movieData = await movieRes.json()
    const creditsData = await creditsRes.json()

    return NextResponse.json({
      ...movieData,
      cast: creditsData.cast,
      crew: creditsData.crew,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
