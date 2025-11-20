exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(403).json({ message: "User login qilmagan" });
        }
  
        if(allowedRoles.includes(req.user.role)) {
          next();
        }
        else {
          return res.status(403).json({ message: "Bu API ga murojaat qilishingizga huquqingiz yo'q" });
        }
      } catch (error) {
        res.status(500).json({ message: "Ruxsat tekshirishda xato", error: error.message });
      }
    };
  };