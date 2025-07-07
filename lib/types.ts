import type { Timestamp } from "firebase/firestore"

export interface User {
  id: string
  email: string
  name: string
  role: "provider" | "client"
  phone?: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface ServiceProvider {
  id: string
  userId: string
  businessName: string
  description: string
  location: string
  phone: string
  website?: string
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Service {
  id: string
  providerId: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  category?: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Booking {
  id: string
  providerId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceId: string
  serviceName: string
  date: string // YYYY-MM-DD format
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  duration: number
  price: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show"
  notes?: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface TimeSlot {
  start: string
  end: string
}

export interface DayAvailability {
  enabled: boolean
  slots: TimeSlot[]
}

export interface WeeklyAvailability {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

export interface ProviderSettings {
  id: string
  providerId: string
  bufferTime: number // minutes between bookings
  maxAdvanceBooking: number // days in advance
  requireConfirmation: boolean
  allowCancellation: boolean
  cancellationDeadline: number // hours before appointment
  emailNotifications: boolean
  smsNotifications: boolean
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Review {
  id: string
  bookingId: string
  providerId: string
  clientName: string
  clientEmail: string
  rating: number
  comment?: string
  createdAt: Timestamp
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  notes: string
}
