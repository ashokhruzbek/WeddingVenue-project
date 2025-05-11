-- Users jadvali
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- bcrypt bilan shifrlanadi
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'owner', 'user'))
);
-- District jadvali
CREATE TABLE District (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Venues jadvali
CREATE TABLE Venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER NOT NULL REFERENCES District(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price_seat DECIMAL(10, 2) NOT NULL CHECK (price_seat >= 0),
    phone_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'tasdiqlanmagan' CHECK (status IN ('tasdiqlangan', 'tasdiqlanmagan')),
    owner_id INTEGER REFERENCES Users(id) ON DELETE SET NULL
);

-- Images jadvali
CREATE TABLE Images (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL REFERENCES Venues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- Bookings jadvali
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL REFERENCES Venues(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count > 0),
    client_phone VARCHAR(20) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('bo`lib o`tgan', 'endi bo`ladigan'))
);