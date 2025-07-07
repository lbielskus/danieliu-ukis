import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, you'd use a real database
const bookings = [
  {
    id: "1",
    providerId: "1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+1234567890",
    service: "Haircut & Styling",
    date: "2024-01-15",
    time: "10:00",
    duration: 60,
    price: 45,
    status: "confirmed",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    providerId: "1",
    clientName: "Sarah Wilson",
    clientEmail: "sarah@example.com",
    clientPhone: "+1234567891",
    service: "Color Treatment",
    date: "2024-01-15",
    time: "14:00",
    duration: 120,
    price: 85,
    status: "pending",
    notes: "First time client",
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const status = searchParams.get("status")
    const date = searchParams.get("date")

    let filteredBookings = bookings

    if (providerId) {
      filteredBookings = filteredBookings.filter((booking) => booking.providerId === providerId)
    }

    if (status && status !== "all") {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    if (date) {
      filteredBookings = filteredBookings.filter((booking) => booking.date === date)
    }

    return NextResponse.json(filteredBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { providerId, clientName, clientEmail, clientPhone, service, date, time, duration, price, notes } = body

    // Validate required fields
    if (!providerId || !clientName || !clientEmail || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for time slot conflicts
    const conflictingBooking = bookings.find(
      (booking) =>
        booking.providerId === providerId &&
        booking.date === date &&
        booking.time === time &&
        booking.status !== "cancelled",
    )

    if (conflictingBooking) {
      return NextResponse.json({ error: "Time slot already booked" }, { status: 409 })
    }

    // Create new booking
    const newBooking = {
      id: (bookings.length + 1).toString(),
      providerId,
      clientName,
      clientEmail,
      clientPhone: clientPhone || "",
      service,
      date,
      time,
      duration: duration || 60,
      price: price || 0,
      status: "pending",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    }

    bookings.push(newBooking)

    // In production, you would also:
    // 1. Send confirmation email to client
    // 2. Send notification to provider
    // 3. Add to calendar
    // 4. Log the transaction

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
