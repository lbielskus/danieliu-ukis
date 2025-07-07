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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = bookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const bookingIndex = bookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Update booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // In production, you would also:
    // 1. Send notification emails for status changes
    // 2. Update calendar entries
    // 3. Log the change
    // 4. Validate the update based on business rules

    return NextResponse.json(bookings[bookingIndex])
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingIndex = bookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const deletedBooking = bookings.splice(bookingIndex, 1)[0]

    // In production, you would also:
    // 1. Send cancellation emails
    // 2. Update calendar
    // 3. Handle refunds if applicable
    // 4. Log the cancellation

    return NextResponse.json({ message: "Booking cancelled successfully", booking: deletedBooking })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}
