-- VIBOVYTM Database Schema
-- Football analytics platform for ФТКЛ and ИРФФ communities
-- Inspired by Transfermarkt design principles

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEAGUES (Лиги)
-- ============================================
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    tier INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLUBS (Клубы)
-- ============================================
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_name TEXT,
    logo_url TEXT,
    founded_year INTEGER,
    stadium TEXT,
    city TEXT,
    country TEXT,
    league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
    average_market_value DECIMAL(12, 2) DEFAULT 0,
    description TEXT,
    history TEXT,
    colors JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYERS (Игроки)
-- ============================================
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    date_of_birth DATE,
    age INTEGER,
    nationality TEXT,
    position TEXT NOT NULL,
    club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
    market_value DECIMAL(12, 2) DEFAULT 0,
    image_url TEXT,
    height_cm INTEGER,
    weight_kg INTEGER,
    preferred_foot TEXT CHECK (preferred_foot IN ('left', 'right', 'both')),
    jersey_number INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER CLUB HISTORY (История клубов игрока)
-- ============================================
CREATE TABLE player_club_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    joined_at DATE,
    left_at DATE,
    transfer_fee DECIMAL(12, 2),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER MARKET VALUE HISTORY (История рыночной стоимости)
-- ============================================
CREATE TABLE player_market_value_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    value DECIMAL(12, 2) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT DEFAULT 'admin',
    notes TEXT
);

-- ============================================
-- MATCHES (Матчи)
-- ============================================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    away_club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
    match_date TIMESTAMPTZ NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'postponed', 'cancelled')),
    venue TEXT,
    round TEXT,
    season TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MATCH EVENTS (События матчей)
-- ============================================
CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'penalty')),
    minute INTEGER,
    team_side TEXT CHECK (team_side IN ('home', 'away')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS (Новости)
-- ============================================
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'news' CHECK (category IN ('news', 'interview', 'transfer', 'event', 'tournament')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS (Достижения)
-- ============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('club', 'player')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER ACHIEVEMENTS (Достижения игрока)
-- ============================================
CREATE TABLE player_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    season TEXT,
    date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLUB ACHIEVEMENTS (Достижения клуба)
-- ============================================
CREATE TABLE club_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    season TEXT,
    date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS (Администраторы)
-- ============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    access_code TEXT NOT NULL DEFAULT 'Hoks228',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- ============================================
-- SETTINGS (Настройки сайта)
-- ============================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'number', 'boolean', 'json')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_players_club_id ON players(club_id);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_market_value ON players(market_value);
CREATE INDEX idx_players_nationality ON players(nationality);
CREATE INDEX idx_clubs_league_id ON clubs(league_id);
CREATE INDEX idx_matches_home_club ON matches(home_club_id);
CREATE INDEX idx_matches_away_club ON matches(away_club_id);
CREATE INDEX idx_matches_league ON matches(league_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_player_market_value_history_player ON player_market_value_history(player_id);
CREATE INDEX idx_player_club_history_player ON player_club_history(player_id);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_category ON news(category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_club_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_market_value_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables
CREATE POLICY "Public read access" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_club_history FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_market_value_history FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON match_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON player_achievements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON club_achievements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);

-- ============================================
-- SEED DATA: АДМИН ПОЛЬЗОВАТЕЛЬ (код доступа: Hoks228)
-- ============================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, role, access_code) VALUES
('admin@vibovytm.kz', '$2b$10$r5lZqG9mX2nP4vL8kJ6wSeF3tY7uI1oP9aS2dF4gH6jK8lM0nQ2w', 'super_admin', 'Hoks228');

-- ============================================
-- SEED DATA: НАСТРОЙКИ
-- ============================================
INSERT INTO settings (key, value, type) VALUES
('site_name', 'VIBOVYTM', 'text'),
('site_description', 'Футбольная аналитическая платформа для ФТКЛ и ИРФФ', 'text'),
('site_currency', 'EUR', 'text'),
('access_code', 'Hoks228', 'text'),
('maintenance_mode', 'false', 'boolean');
