"use client"

import { useState, useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Calendar,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Heart,
  Building,
  PlusCircle,
  List,
  Clock,
  ChevronDown,
  MapPin,
  Shield,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { useFloating, autoUpdate, offset, shift, useHover, useInteractions, FloatingPortal } from "@floating-ui/react"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState("")
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Check screen size
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setIsOpen(false)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Check token and user data
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          toast.error("Sessiya muddati tugadi. Iltimos, qayta kiring!", {
            duration: 3000,
            action: { label: "Kirish", onClick: () => navigate("/login") },
          })
          handleLogout()
          return
        }
        setUserRole(decoded.role || "user")
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
          setUserName(`${user.firstname} ${user.lastname}`)
        } else {
          toast.warn("Foydalanuvchi ma'lumotlari topilmadi!")
        }
      } catch (error) {
        console.error("Noto‘g‘ri token:", error)
        toast.error("Noto‘g‘ri token. Iltimos, qayta kiring!", {
          duration: 3000,
        })
        handleLogout()
      }
    } else {
      toast.error("Iltimos, avval tizimga kiring!", {
        duration: 3000,
        action: { label: "Kirish", onClick: () => navigate("/login") },
      })
      navigate("/login")
    }
  }, [navigate])

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Tizimdan muvaffaqiyatli chiqdingiz!", {
      duration: 2000,
    })
    navigate("/login")
  }

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  // Handle hover with delay
  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(setTimeout(() => setIsOpen(true), 150))
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(setTimeout(() => setIsOpen(false), 300))
    }
  }

  // Tooltip component
  const Tooltip = ({ label, children }) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)
    const { refs, floatingStyles, context } = useFloating({
      open: isTooltipOpen,
      onOpenChange: setIsTooltipOpen,
      middleware: [offset(12), shift()],
      whileElementsMounted: autoUpdate,
    })
    const hover = useHover(context, { move: false })
    const { getReferenceProps, getFloatingProps } = useInteractions([hover])

    return (
      <>
        <span ref={refs.setReference} {...getReferenceProps()} className="flex items-center">
          {children}
        </span>
        {isTooltipOpen && (
          <FloatingPortal>
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm px-3 py-1.5 rounded-lg shadow-xl z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.div>
          </FloatingPortal>
        )}
      </>
    )
  }

  // Role-based navigation items
  const getNavItems = useMemo(() => {
    const commonItems = [
      { title: "Bosh sahifa", icon: <Home size={20} />, path: "/" },
    ]

    const adminItems = [
      {
        title: "Admin paneli",      
        icon: <Shield size={20} />,
        submenu: true,
        submenuName: "admin",
        items: [
          { title: "Foydalanuvchilar", path: "/admin/user", icon: <Users size={18} /> },
          { title: "To‘yxonalar", path: "/admin/venues", icon: <Building size={18} /> },
          { title: "Yangi to‘yxona", path: "/admin/create-venue", icon: <PlusCircle size={18} /> },
          { title: "Egasi qo‘shish", path: "/admin/create-owner", icon: <User size={18} /> },
          { title: "Egasini biriktirish", path: "/admin/assign-owner", icon: <CheckCircle size={18} /> },
          { title: "To‘yxona tasdiqlash", path: "/admin/approve-venue", icon: <CheckCircle size={18} /> },
          { title: "Buyurtmalarni boshqarish", path: "/admin/bookings", icon: <Calendar size={18} /> },
          { title: "Tumanlar", path: "/admin/districts", icon: <MapPin size={18} /> },
        ],
      },
    ]

    const ownerItems = [
      {
        title: "To‘yxonalarim",
        icon: <Building size={20} />,
        submenu: true,
        submenuName: "venues",
        items: [
          { title: "Barcha to‘yxonalar", path: "/owner/venues", icon: <List size={18} /> },
          { title: "Yangi to‘yxona", path: "/owner/reg-owner", icon: <PlusCircle size={18} /> },
          { title: "To‘yxona yangilash", path: "/owner/update-venue", icon: <Building size={18} /> },
        ],
      },
      {
        title: "Buyurtmalar",
        icon: <Calendar size={20} />,
        submenu: true,
        submenuName: "bookings",
        items: [
           { title: "To‘yxona buyurtmalari", path: "/owner/bookings", icon: <Calendar size={18} /> },
        ],
      },
      {
        title: "Tumanlar",
        icon: <MapPin size={20} />,
        submenu: true,
        submenuName: "districts",
        items: [
          { title: "Hamma tumanlar", path: "/owner/districts", icon: <MapPin size={18} /> },
         ],
      },
    ]

    const userItems = [
      { title: "To‘yxonalar", icon: <Building size={20} />, path: "/user/venues", },
      { title: "Sevimlilar", icon: <Heart size={20} />, path: "/user/favorites", },
      { title: "Buyurtmalarim", icon: <Calendar size={20} />, path: "/user/bookings", },
    ]

    const profileSettings = [
      { title: "Profil", icon: <User size={20} />, path: `/${userRole}/profile` },
      { title: "Sozlamalar", icon: <Settings size={20} />, path: `/${userRole}/settings` },
    ]

    switch (userRole) {
      case "admin":
        return [...commonItems, ...adminItems, ...profileSettings]
      case "owner":
        return [...commonItems, ...ownerItems, ...profileSettings]
      case "user":
        return [...commonItems, ...userItems, ...profileSettings]
      default:
        return commonItems
    }
  }, [userRole])

  // Animation variants
  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : "280px",
      transition: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
    },
    closed: {
      width: isMobile ? "0" : "60px",
      transition: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
    },
  }

  const iconVariants = {
    open: { scale: 1, rotate: 0, transition: { duration: 0.3 } },
    closed: { scale: 1.2, rotate: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.2 } },
  }

  const textVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.3 } },
  }

  const submenuVariants = {
    open: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
    closed: { height: 0, opacity: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  }

  // Check if path is active
  const isActivePath = (path) => location.pathname === path

  // Check if submenu has active path
  const hasActivePath = (items) => items.some((item) => isActivePath(item.path))

  return (
    <>
      {/* Mobile menu toggle button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 overflow-hidden group ${
            isMobile && !isOpen ? "hidden" : "flex flex-col"
          }`}
          animate={isOpen ? "open" : "closed"}
          variants={sidebarVariants}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-b from-pink-50 to-white">
            <motion.div className="flex items-center justify-center w-full" variants={iconVariants}>
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-lg">
                <Heart size={24} fill="white" />
              </div>
              {isOpen && (
                <motion.h1
                  className="ml-3 text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
                  variants={textVariants}
                >
                  To‘yxona.uz
                </motion.h1>
              )}
            </motion.div>
          </div>

          {/* User info */}
          

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {getNavItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isOpen ? index * 0.05 : 0, duration: 0.3 }}
                >
                  {item.submenu ? (
                    <div>
                      <button
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          activeSubmenu === item.submenuName || hasActivePath(item.items)
                            ? "bg-pink-100 text-pink-600"
                            : "hover:bg-pink-50 text-gray-700"
                        } ${!isOpen ? "justify-center" : ""}`}
                        onClick={() => isOpen && toggleSubmenu(item.submenuName)}
                      >
                        <motion.div
                          className={`flex items-center ${!isOpen ? "justify-center w-full" : ""}`}
                          variants={iconVariants}
                          layout
                        >
                          {!isOpen ? (
                            <Tooltip label={item.title}>
                              <span
                                className={`${
                                  activeSubmenu === item.submenuName || hasActivePath(item.items)
                                    ? "text-pink-600"
                                    : "text-gray-500"
                                } p-2 rounded-full hover:bg-pink-50`}
                              >
                                {item.icon}
                              </span>
                            </Tooltip>
                          ) : (
                            <span
                              className={`${
                                activeSubmenu === item.submenuName || hasActivePath(item.items)
                                  ? "text-pink-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {item.icon}
                            </span>
                          )}
                          {isOpen && (
                            <motion.span className="ml-3 font-medium" variants={textVariants}>
                              {item.title}
                            </motion.span>
                          )}
                        </motion.div>
                        {isOpen && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${activeSubmenu === item.submenuName ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>

                      {/* Submenu */}
                      {isOpen && (
                        <AnimatePresence>
                          {activeSubmenu === item.submenuName && (
                            <motion.ul
                              className="ml-4 mt-1 space-y-1 overflow-hidden"
                              variants={submenuVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                            >
                              {item.items.map((subItem, subIndex) => (
                                <motion.li
                                  key={subIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.1 }}
                                >
                                  <Link
                                    to={subItem.path}
                                    className={`flex items-center p-2 pl-6 rounded-lg transition-colors ${
                                      isActivePath(subItem.path)
                                        ? "bg-pink-100 text-pink-600"
                                        : "hover:bg-pink-50 text-gray-600"
                                    }`}
                                    onClick={() => isMobile && setIsOpen(false)}
                                  >
                                    <span className="text-pink-400 mr-2">{subItem.icon}</span>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        isActivePath(item.path) ? "bg-pink-100 text-pink-600" : "hover:bg-pink-50 text-gray-700"
                      } ${!isOpen ? "justify-center" : ""}`}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <motion.div
                        className={`flex items-center ${!isOpen ? "justify-center w-full" : ""}`}
                        variants={iconVariants}
                        layout
                      >
                        {!isOpen ? (
                          <Tooltip label={item.title}>
                            <span
                              className={`${
                                isActivePath(item.path) ? "text-pink-600" : "text-gray-500"
                              } p-2 rounded-full hover:bg-pink-50`}
                            >
                              {item.icon}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className={`${isActivePath(item.path) ? "text-pink-600" : "text-gray-500"}`}>
                            {item.icon}
                          </span>
                        )}
                        {isOpen && (
                          <motion.span className="ml-3 font-medium" variants={textVariants}>
                            {item.title}
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
          {userRole && (
            <div className="p-4 border-b">
              <motion.div className="flex items-center justify-center w-full" variants={iconVariants}>
                <Tooltip label="Foydalanuvchi">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    {userName ? userName.charAt(0) : "U"}
                  </div>
                </Tooltip>
                {isOpen && (
                  <motion.div className="ml-3" variants={textVariants}>
                    <p className="font-medium text-gray-800">{userName || "Foydalanuvchi"}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userRole === "admin" ? "Administrator" : userRole === "owner" ? "To‘yxona egasi" : "Foydalanuvchi"}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}

          {/* Logout button */}
          <div className="p-4 border-t">
            <button
              className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-pink-50 transition-colors ${
                !isOpen ? "justify-center" : ""
              }`}
              onClick={handleLogout}
            >
              <motion.div
                className={`flex items-center ${!isOpen ? "justify-center w-full" : ""}`}
                variants={iconVariants}
                layout
              >
                {!isOpen ? (
                  <Tooltip label="Chiqish">
                    <span className="text-pink-500 p-2 rounded-full hover:bg-pink-50">
                      <LogOut size={20} />
                    </span>
                  </Tooltip>
                ) : (
                  <span className="text-pink-500">
                    <LogOut size={20} />
                  </span>
                )}
                
                {isOpen && (
                  <motion.span className="ml-3 font-medium" variants={textVariants}>
                    Chiqish
                  </motion.span>
                )}
              </motion.div>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Sidebar