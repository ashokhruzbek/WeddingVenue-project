import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Mybookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setError(
            "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan kiring."
          );
          toast.error(
            "Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan kiring."
          );
          setLoading(false);
          return;
        }
        const userId = user.id; // Correctly scoped userId
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Avtorizatsiya tokeni topilmadi. Iltimos, qaytadan kiring.");
          toast.error(
            "Avtorizatsiya tokeni topilmadi. Iltimos, qaytadan kiring."
          );
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://13.51.241.247/api/user/get-user-booking/${userId}`,
          {
            // Changed id to userId
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.bookings) {
          setBookings(response.data.bookings);
        } else {
          setBookings([]);
          toast.info("Sizda hali bronlar mavjud emas.");
        }
      } catch (err) {
        console.error("Bronlarni yuklashda xatolik:", err);
        const errorMsg =
          err.response?.data?.message ||
          "Bronlarni yuklashda server xatoligi yuz berdi.";
        setError(errorMsg);
        toast.error(errorMsg);
        if (err.response?.status === 401) {
          // Handle unauthorized access, e.g., redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Consider redirecting to login page here
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    // Confirm dialog
    if (!window.confirm("Rostdan ham bu bronni bekor qilmoqchimisiz?")) {
      return;
    }

    setCancellingBookingId(bookingId);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Avtorizatsiya tokeni topilmadi. Iltimos, qaytadan kiring."
        );
        return;
      }

      const response = await axios.delete(
        `http://13.51.241.247/api/api/users/cancel-booking/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the cancelled booking from the list
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );

        toast.success("Bron muvaffaqiyatli bekor qilindi!");
      }
    } catch (error) {
      console.error("Bronni bekor qilishda xatolik:", error);

      let errorMessage = "Bronni bekor qilishda xatolik yuz berdi.";

      if (error.response?.status === 404) {
        errorMessage = "Bron topilmadi.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bu bronni bekor qilish uchun ruxsatingiz yo'q.";
      } else if (error.response?.status === 401) {
        errorMessage = "Avtorizatsiya xatoligi. Iltimos, qaytadan kiring.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setCancellingBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-pink-700">
            Bronlar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto text-center"
          role="alert"
        >
          <strong className="font-bold">Xatolik!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-8 text-center">
          Mening Bronlarim
        </h1>

        {bookings.length === 0 && !loading && (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-pink-100">
            <svg
              className="mx-auto h-12 w-12 text-pink-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4 text-xl text-gray-700">
              Sizda hozircha aktiv bronlar mavjud emas.
            </p>
            <p className="text-gray-500 mt-2">
              To'yxona bron qilish uchun asosiy sahifaga o'ting.
            </p>
            {/* Siz bu yerga asosiy sahifaga link qo'yishingiz mumkin */}
            {/* <Link to="/" className="mt-6 inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">Asosiy sahifa</Link> */}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 border-2 border-pink-100 hover:border-pink-300"
              >
                <div className="md:flex">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-pink-700 mb-2">
                        {booking.venue_name || "Noma'lum To'yxona"}
                      </h2>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : booking.status === "endi bo`ladigan"
                            ? "bg-blue-100 text-blue-700" // Added specific status
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Tasdiqlangan"
                          : booking.status === "pending"
                          ? "Kutilmoqda"
                          : booking.status === "cancelled"
                          ? "Bekor qilingan"
                          : booking.status === "endi bo`ladigan"
                          ? "Kelgusi" // Added specific status text
                          : booking.status?.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Mijoz:</span>{" "}
                      {booking.firstname} {booking.lastname}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Telefon:</span>{" "}
                      {booking.client_phone}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Hudud:</span>{" "}
                      {booking.district_name || "Noma'lum"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Sana:</span>{" "}
                      {new Date(booking.reservation_date).toLocaleDateString(
                        "uz-UZ",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Vaqt:</span>{" "}
                      {new Date(booking.reservation_date).toLocaleTimeString(
                        "uz-UZ",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                    <p className="text-gray-600 mb-3">
                      <span className="font-semibold">Odam soni:</span>{" "}
                      {booking.guest_count || "Noma'lum"}
                    </p>

                    <div className="border-t border-pink-100 pt-4 mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      {booking.status !== "cancelled" &&
                        booking.status !== "completed" &&
                        booking.status !== "passed" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingBookingId === booking.id}
                            className={`bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm ${
                              cancellingBookingId === booking.id
                                ? "opacity-50 cursor-not-allowed transform-none"
                                : ""
                            }`}
                          >
                            {cancellingBookingId === booking.id ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Bekor qilinmoqda...
                              </div>
                            ) : (
                              "Bronni bekor qilish"
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Mybookings;
