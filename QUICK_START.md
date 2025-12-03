# 🎊 Wedding Venue Project - Quick Start Guide

## 🚀 Running the Application

### Frontend (Vite + React)
```bash
cd frontend
npm install  # If not already installed
npm run dev
```
**Access at**: http://localhost:5174/

### Backend (Node.js + Express)
```bash
cd backend
npm install  # If not already installed
npm start
```
**Access at**: http://localhost:3000/

---

## 🎨 New Features Overview

### 1. **Enhanced Landing Page** 
- Visit: http://localhost:5174/
- Features GSAP scroll animations
- Wedding-themed hero section
- Testimonials and stats sections
- Smooth transitions and micro-interactions

### 2. **Admin Dashboard**
- Login as admin and visit: http://localhost:5174/admin
- New animated stats cards
- Quick action buttons
- Recent activities timeline
- Professional metrics display

### 3. **Owner Dashboard**
- Login as owner and visit: http://localhost:5174/owner
- Revenue tracking with trends
- Venue management shortcuts
- Booking overview
- Business analytics

### 4. **User Dashboard**
- Login as user and visit: http://localhost:5174/user
- Favorite venues tracker
- Upcoming events display
- Recommended venues
- Motivational banners

---

## 🎯 Design Features to Test

### Landing Page
1. **Scroll down** to see animated sections appearing
2. **Hover over** stat cards to see scale effects
3. **Check mobile menu** by resizing browser
4. **Click scroll-to-top** button when at bottom

### Dashboards
1. **Hover over** stats cards to see animations
2. **Click** quick action buttons for navigation
3. **View** recent activities/bookings
4. **Test** loading states (appear on page load)

### Components
1. **Header**: Hover over logo and navigation items
2. **Footer**: Check animated social icons
3. **Buttons**: Hover for gradient transitions
4. **Cards**: Scale and shadow effects on hover

---

## 📱 Responsive Testing

Test on different screen sizes:
- **Mobile**: < 640px (iPhone, Android)
- **Tablet**: 640px - 1024px (iPad)
- **Desktop**: 1024px+ (Laptops, Monitors)

### Browser DevTools
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select different devices
4. Test animations and responsiveness

---

## 🎨 Color Palette Reference

### Primary Colors
- **Navy Blue**: `#1E3A5F` - Main text, headers
- **Gold**: `#D4AF37` - Accents, CTAs, highlights

### Accent Colors
- **Success Green**: `#10B981` - Confirmed, positive
- **Warning Orange**: `#F59E0B` - Pending, caution
- **Error Red**: `#EF4444` - Errors, favorites
- **Info Blue**: `#3B82F6` - Information, links

### Neutral Colors
- **White**: `#FFFFFF`
- **Cream**: `#FFF8F0`
- **Light Gray**: `#F9FAFB`
- **Gray**: `#6B7280`

---

## 🔧 Configuration Files

### Theme Configuration
`frontend/src/theme/weddingTheme.js`
- Modify colors, typography, spacing
- Add new design tokens

### Routes
`frontend/src/routes/index.jsx`
- All route definitions
- Layout mappings

### App Entry
`frontend/src/App.jsx`
- Main app component
- Toast notifications config

---

## 📦 Key Dependencies

### Animation
- `gsap` - Advanced animations
- `framer-motion` - React animations

### UI Components
- `@mui/material` - Material Design components
- `@mui/icons-material` - Material icons
- `lucide-react` - Additional icons

### Styling
- `tailwindcss` - Utility CSS
- `@emotion/styled` - CSS-in-JS

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or let Vite use another port (automatic)
```

### Animations Not Working
1. Check browser console for errors
2. Ensure GSAP is installed: `npm install gsap`
3. Clear browser cache (Ctrl+Shift+R)

### Icons Not Showing
1. Verify MUI installation: `npm install @mui/icons-material`
2. Check import statements
3. Restart dev server

### Styles Not Applied
1. Clear Tailwind cache: `rm -rf .next/cache`
2. Restart Vite server
3. Check tailwind.config.js

---

## 📚 Documentation

- **Design Tokens**: `src/theme/weddingTheme.js`
- **Component Library**: `src/components/shared/`
- **GSAP Docs**: https://greensock.com/docs/
- **MUI Docs**: https://mui.com/material-ui/

---

## 🎯 Testing Checklist

### Landing Page
- [ ] Hero section animates on load
- [ ] Scroll triggers section animations
- [ ] Mobile menu works
- [ ] All links functional
- [ ] Footer displays correctly

### Admin Dashboard
- [ ] Stats cards animate on load
- [ ] Quick actions work
- [ ] Activities display
- [ ] Responsive on mobile

### Owner Dashboard
- [ ] Revenue stats display
- [ ] Bookings list loads
- [ ] Quick actions functional
- [ ] Gradient effects work

### User Dashboard
- [ ] Favorites counter works
- [ ] Upcoming events show
- [ ] Recommended venues display
- [ ] CTA banner links work

---

## 🚀 Deployment Notes

### Before Deployment
1. Run `npm run build` in frontend folder
2. Test production build: `npm run preview`
3. Check all API endpoints
4. Verify environment variables

### Environment Variables
```env
# Frontend
VITE_API_URL=your_backend_url

# Backend
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

## 💡 Tips

1. **Use Chrome DevTools** for animation debugging
2. **Test on real devices** for accurate touch interactions
3. **Check lighthouse scores** for performance
4. **Use React DevTools** for component inspection

---

## 🎉 Enjoy!

Your Wedding Venue platform is now beautifully designed with:
- ✨ Smooth GSAP animations
- 🎨 Professional wedding theme
- 📱 Fully responsive design
- 🎯 Intuitive user experience

**Need help?** Check the DESIGN_ENHANCEMENTS.md file for detailed documentation.

---

**Happy Building! 💍✨**
