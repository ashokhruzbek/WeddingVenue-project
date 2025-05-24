"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchBookings() {
    try {
      const token = localStorage.getItem("token")
      const userJson = localStorage.getItem("user")
      const user = userJson ? JSON.parse(userJson) : null

      if (!token) {
        toast({
          title: "Xatolik",
          description: "Tizimga kirish talab qilinadi",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const userId = user?.id ?? 9 // demo uchun 9 default

      const response = await fetch(
        `http://localhost:4000/user/get-user-booking/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)

      setBookings([
        {
          id: 1,
          booking_date: "2024-06-15",
          guest_count: 200,
          total_price: 15000000,
          status: "confirmed",
          created_at: "2024-05-20",
          venue: {
            id: 1,
            name: "Oq Saroy To'yxonasi",
            location: "Toshkent, Yunusobod tumani",
            phone: "+998901234567",
            images: ["/placeholder.svg?height=100&width=100"],
          },
        },
        {
          id: 2,
          booking_date: "2024-07-20",
          guest_count: 150,
          total_price: 12000000,
          status: "pending",
          created_at: "2024-05-22",
          venue: {
            id: 2,
            name: "Guliston Palace",
            location: "Toshkent, Mirzo Ulug'bek tumani",
            phone: "+998901234568",
            images: ["/placeholder.svg?height=100&width=100"],
          },
        },
      ])

      toast({
        title: "Ogohlantirish",
        description: "API bilan bog'lanishda muammo. Demo ma'lumotlar ko'rsatilmoqda.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function cancelBooking(bookingId) {
    setCancellingId(bookingId)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Xatolik",
          description: "Tizimga kirish talab qilinadi",
          variant: "destructive",
        })
        setCancellingId(null)
        return
      }

      const response = await fetch(
        `http://localhost:4000/user/cancel-booking/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
      toast({
        title: "Muvaffaqiyat",
        description: "Buyurtma bekor qilindi",
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)

      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
      toast({
        title: "Demo rejim",
        description: "Buyurtma demo rejimda bekor qilindi",
      })
    } finally {
      setCancellingId(null)
    }
  }

  function getStatusBadge(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Kutilmoqda
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Tasdiqlangan
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Bekor qilingan
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  function canCancelBooking(booking) {
    const bookingDate = new Date(booking.booking_date)
    const today = new Date()
    const diffTime = bookingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return booking.status.toLowerCase() !== "cancelled" && diffDays > 1
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Buyurtmalarim</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Buyurtmalarim
        </h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hozircha buyurtmalaringiz yo'q</h3>
          <p className="text-gray-500 mb-4">To'yxonalar bo'limidan kerakli to'yxonani tanlang</p>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
            To'yxonalarni ko'rish
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={booking.venue.images?.[0] || "/placeholder.svg?height=100&width=100"}
                      alt={booking.venue.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{booking.venue.name}</CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-pink-500" />
                          <span>{formatDate(booking.booking_date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-pink-500" />
                          <span>{booking.guest_count} kishi</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-pink-500" />
                          <span className="line-clamp-1">{booking.venue.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-pink-500" />
                          <span>{booking.venue.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-pink-600">
                          {booking.total_price.toLocaleString()} so'm
                        </div>

                        <div className="flex gap-2">
                          {canCancelBooking(booking) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  disabled={cancellingId === booking.id}
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Bekor qilish
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertCircle className="text-red-500" size={20} />
                                    Buyurtmani bekor qilish
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Yo'q</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => cancelBooking(booking.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Ha, bekor qilish
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          <Button size="sm" variant="outline">
                            Batafsil
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Buyurtma sanasi: {formatDate(booking.created_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
