const pool = require('../../config/db');

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userRole = req.user.role;
    const currentUserId = req.user.id;

    console.log('Cancel booking request:', {
      bookingId,
      userRole,
      currentUserId
    });

    // 1. Bron mavjudligini tekshirish
    const existing = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    const booking = existing.rows[0];
    
    console.log('Booking details:', {
      bookingId: booking.id,
      booking_user_id: booking.user_id,
      current_user_id: currentUserId,
      user_role: userRole
    });

    // 2. Admin va manager barcha bronlarni o'chira oladi
    if (userRole === 'admin' || userRole === 'manager') {
      await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
      return res.status(200).json({ 
        message: `Bron bekor qilindi (${userRole} tomonidan)`,
        deletedBooking: {
          id: booking.id,
          userId: booking.user_id
        }
      });
    }

    // 3. User faqat o'z bronini o'chira oladi
    if (userRole === 'user') {
      if (booking.user_id === parseInt(currentUserId)) {
        await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId]);
        return res.status(200).json({ 
          message: "Bron bekor qilindi (foydalanuvchi tomonidan)",
          deletedBooking: {
            id: booking.id,
            userId: booking.user_id
          }
        });
      } else {
        console.log('Permission denied:', {
          booking_user_id: booking.user_id,
          current_user_id: currentUserId,
          are_equal: booking.user_id === parseInt(currentUserId)
        });
        return res.status(403).json({ 
          message: "Bu bronni o'chirishga ruxsatingiz yo'q" 
        });
      }
    }

    // 4. Noma'lum rol
    return res.status(403).json({ message: "Ruxsatsiz kirish" });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      message: "Xatolik yuz berdi", 
      error: error.message 
    });
  }
};