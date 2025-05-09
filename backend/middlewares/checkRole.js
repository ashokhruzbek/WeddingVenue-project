exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(403).json({ message: "User login qilmagan" });
        }
  
              if(allowedRoles.includes(req.user.role)) { // owner
                  next()
              }
              else {
                  return res.status(403).json({ message: "Bu API ga murojaat qilishingizga huquqingiz yo'q" });
              }
      } catch (error) {}
    };
  };