-- =====================================================
-- EduQuiz Pro — Supabase Database Setup SQL
-- Run this in Supabase SQL Editor after creating your project
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SITE SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'EduQuiz Pro',
  logo_url TEXT,
  favicon_url TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(255),
  whatsapp_link TEXT,
  telegram_link TEXT,
  rate_app_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (site_name, contact_email)
VALUES ('EduQuiz Pro', 'admin@eduquiz.pro')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  icon_type VARCHAR(50) DEFAULT 'emoji',
  category_type VARCHAR(50) NOT NULL,
  color_code VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. COURSES
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  course_code VARCHAR(100) UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id, display_order);

-- =====================================================
-- 4. SUBJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_hindi VARCHAR(255),
  description TEXT,
  subject_code VARCHAR(100),
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subjects_course ON subjects(course_id, display_order);

-- =====================================================
-- 5. SETS
-- =====================================================
CREATE TABLE IF NOT EXISTS sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_hindi VARCHAR(255),
  description TEXT,
  total_questions INTEGER,
  duration_minutes INTEGER,
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_locked BOOLEAN DEFAULT false,
  unlock_type VARCHAR(20) DEFAULT 'free',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sets_subject ON sets(subject_id, display_order);

-- =====================================================
-- 6. QUESTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  set_id UUID REFERENCES sets(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'mcq',
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer VARCHAR(10) NOT NULL,
  explanation TEXT,
  explanation_image_url TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium',
  marks INTEGER DEFAULT 1,
  negative_marks INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_questions_set ON questions(set_id, display_order);

-- =====================================================
-- 7. SYLLABUS
-- =====================================================
CREATE TABLE IF NOT EXISTS syllabus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(20) DEFAULT 'pdf',
  file_url TEXT NOT NULL,
  external_link TEXT,
  is_downloadable BOOLEAN DEFAULT true,
  badge_color VARCHAR(50),
  badge_text VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_syllabus_course ON syllabus(course_id, display_order);

-- =====================================================
-- 8. UPDATE SECTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS update_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. UPDATE ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS update_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES update_sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  published_date DATE,
  expiry_date DATE,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_update_items_section ON update_items(section_id, published_date);

-- =====================================================
-- 10. UPDATE BUTTONS
-- =====================================================
CREATE TABLE IF NOT EXISTS update_buttons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES update_items(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  button_type VARCHAR(20) DEFAULT 'link',
  url TEXT,
  action TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. DAILY TESTS
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  language VARCHAR(20) DEFAULT 'english',
  total_questions INTEGER,
  duration_minutes INTEGER,
  is_locked BOOLEAN DEFAULT false,
  unlock_type VARCHAR(20) DEFAULT 'ad_based',
  allow_retake BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_daily_tests_course ON daily_tests(course_id, test_date);

-- =====================================================
-- 12. DAILY QUESTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES daily_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer VARCHAR(10) NOT NULL,
  explanation TEXT,
  marks INTEGER DEFAULT 1,
  negative_marks INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_daily_questions_test ON daily_questions(test_id, display_order);

-- =====================================================
-- 13. MOCK TESTS
-- =====================================================
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_questions INTEGER,
  duration_minutes INTEGER,
  full_mock BOOLEAN DEFAULT true,
  shuffle_questions BOOLEAN DEFAULT true,
  show_answers_after BOOLEAN DEFAULT true,
  allow_retake BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mock_tests_course ON mock_tests(course_id, display_order);

-- =====================================================
-- 14. MOCK QUESTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS mock_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer VARCHAR(10) NOT NULL,
  explanation TEXT,
  marks INTEGER DEFAULT 1,
  negative_marks INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mock_questions_test ON mock_questions(mock_test_id, display_order);

-- =====================================================
-- 15. PREVIOUS PAPERS
-- =====================================================
CREATE TABLE IF NOT EXISTS previous_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exam_year INTEGER,
  exam_month VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  external_link TEXT,
  is_downloadable BOOLEAN DEFAULT true,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_previous_papers_course ON previous_papers(course_id, exam_year);

-- =====================================================
-- 16. USER PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  state VARCHAR(255),
  district VARCHAR(255),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  preferred_language VARCHAR(20) DEFAULT 'english',
  total_tests_taken INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 17. RESULTS
-- =====================================================
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_id VARCHAR(255) NOT NULL,
  test_type VARCHAR(50) NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  skipped_answers INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  time_taken_seconds INTEGER,
  rank INTEGER,
  attempt_number INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'completed',
  test_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id, test_date);
CREATE INDEX IF NOT EXISTS idx_results_test ON results(test_id, test_type);
CREATE INDEX IF NOT EXISTS idx_results_course ON results(course_id, test_date);

-- =====================================================
-- 18. NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  description TEXT,
  notification_type VARCHAR(50) DEFAULT 'info',
  link TEXT,
  icon_url TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_date ON notifications(published_date DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE previous_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES — Allow public read for app users
-- =====================================================

-- Site settings: anyone can read
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Categories: anyone can read active
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);

-- Courses: anyone can read active
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (is_active = true);

-- Subjects: anyone can read active
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (is_active = true);

-- Sets: anyone can read active
CREATE POLICY "Public read sets" ON sets FOR SELECT USING (is_active = true);

-- Questions: anyone can read active
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (is_active = true);

-- Syllabus: anyone can read active
CREATE POLICY "Public read syllabus" ON syllabus FOR SELECT USING (is_active = true);

-- Update sections: anyone can read active
CREATE POLICY "Public read update_sections" ON update_sections FOR SELECT USING (is_active = true);

-- Update items: anyone can read active
CREATE POLICY "Public read update_items" ON update_items FOR SELECT USING (is_active = true);

-- Update buttons: anyone can read active
CREATE POLICY "Public read update_buttons" ON update_buttons FOR SELECT USING (is_active = true);

-- Daily tests: anyone can read active
CREATE POLICY "Public read daily_tests" ON daily_tests FOR SELECT USING (is_active = true);

-- Daily questions: anyone can read
CREATE POLICY "Public read daily_questions" ON daily_questions FOR SELECT USING (true);

-- Mock tests: anyone can read active
CREATE POLICY "Public read mock_tests" ON mock_tests FOR SELECT USING (is_active = true);

-- Mock questions: anyone can read
CREATE POLICY "Public read mock_questions" ON mock_questions FOR SELECT USING (true);

-- Previous papers: anyone can read active
CREATE POLICY "Public read previous_papers" ON previous_papers FOR SELECT USING (is_active = true);

-- User profiles: anyone can read, users can insert/update own
CREATE POLICY "Public read user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user_profiles" ON user_profiles FOR UPDATE USING (true);

-- Results: anyone can read and insert
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update results" ON results FOR UPDATE USING (true);

-- Notifications: anyone can read active
CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (is_active = true);

-- =====================================================
-- UPDATED_AT TRIGGER (auto-update timestamp)
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sets_updated_at BEFORE UPDATE ON sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_syllabus_updated_at BEFORE UPDATE ON syllabus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_update_sections_updated_at BEFORE UPDATE ON update_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_update_items_updated_at BEFORE UPDATE ON update_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_update_buttons_updated_at BEFORE UPDATE ON update_buttons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_tests_updated_at BEFORE UPDATE ON daily_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_questions_updated_at BEFORE UPDATE ON daily_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mock_tests_updated_at BEFORE UPDATE ON mock_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mock_questions_updated_at BEFORE UPDATE ON mock_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_previous_papers_updated_at BEFORE UPDATE ON previous_papers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Categories
INSERT INTO categories (title, icon_url, category_type, color_code, display_order, is_new) VALUES
('MCQ', '📝', 'mcq', '#ef4444', 1, false),
('Syllabus', '📚', 'syllabus', '#f97316', 2, false),
('Updates', '📰', 'updates', '#eab308', 3, false),
('Daily Test', '📅', 'daily_test', '#22c55e', 4, true),
('Daily Result', '🏆', 'daily_result', '#06b6d4', 5, false),
('Previous Papers', '📄', 'previous_papers', '#3b82f6', 6, false),
('Mock Test', '🎯', 'mock_test', '#8b5cf6', 7, true),
('Jobs', '💼', 'jobs', '#ec4899', 8, false);

-- Courses for MCQ
INSERT INTO courses (category_id, name, description, display_order) VALUES
((SELECT id FROM categories WHERE category_type='mcq'), 'General Knowledge', 'Test your general awareness', 1),
((SELECT id FROM categories WHERE category_type='mcq'), 'Science', 'Physics, Chemistry, Biology', 2),
((SELECT id FROM categories WHERE category_type='mcq'), 'Mathematics', 'Algebra, Geometry, Arithmetic', 3);

-- Courses for Daily Test
INSERT INTO courses (category_id, name, description, display_order) VALUES
((SELECT id FROM categories WHERE category_type='daily_test'), 'Daily GK Test', 'Daily general knowledge quiz', 1),
((SELECT id FROM categories WHERE category_type='daily_test'), 'Daily Science Test', 'Daily science questions', 2);

-- Courses for Mock Test
INSERT INTO courses (category_id, name, description, display_order) VALUES
((SELECT id FROM categories WHERE category_type='mock_test'), 'Full Mock Test', 'Complete mock exam', 1);

-- Subjects for Science
INSERT INTO subjects (course_id, name, name_hindi, display_order) VALUES
((SELECT id FROM courses WHERE name='Science'), 'Physics', 'भौतिक विज्ञान', 1),
((SELECT id FROM courses WHERE name='Science'), 'Chemistry', 'रसायन विज्ञान', 2),
((SELECT id FROM courses WHERE name='Science'), 'Biology', 'जीव विज्ञान', 3);

-- Subjects for General Knowledge
INSERT INTO subjects (course_id, name, name_hindi, display_order) VALUES
((SELECT id FROM courses WHERE name='General Knowledge'), 'History', 'इतिहास', 1),
((SELECT id FROM courses WHERE name='General Knowledge'), 'Geography', 'भूगोल', 2),
((SELECT id FROM courses WHERE name='General Knowledge'), 'Polity', 'राजनीति विज्ञान', 3);

-- Subjects for Mathematics
INSERT INTO subjects (course_id, name, name_hindi, display_order) VALUES
((SELECT id FROM courses WHERE name='Mathematics'), 'Algebra', 'बीजगणित', 1),
((SELECT id FROM courses WHERE name='Mathematics'), 'Geometry', 'ज्यामिति', 2),
((SELECT id FROM courses WHERE name='Mathematics'), 'Arithmetic', 'अंकगणित', 3);

-- Sample Sets for Physics
INSERT INTO sets (subject_id, title, title_hindi, total_questions, difficulty, is_locked, display_order) VALUES
((SELECT id FROM subjects WHERE name='Physics'), 'Set 1 - Basics', 'सेट 1 - मूल भौतिकी', 5, 'easy', false, 1),
((SELECT id FROM subjects WHERE name='Physics'), 'Set 2 - Mechanics', 'सेट 2 - यांत्रिकी', 5, 'medium', false, 2),
((SELECT id FROM subjects WHERE name='Physics'), 'Set 3 - Advanced', 'सेट 3 - उन्नत', 5, 'hard', true, 3);

-- Sample Sets for History
INSERT INTO sets (subject_id, title, title_hindi, total_questions, difficulty, is_locked, display_order) VALUES
((SELECT id FROM subjects WHERE name='History'), 'Set 1 - Ancient India', 'सेट 1 - प्राचीन भारत', 5, 'easy', false, 1),
((SELECT id FROM subjects WHERE name='History'), 'Set 2 - Medieval India', 'सेट 2 - मध्यकालीन भारत', 5, 'medium', false, 2);

-- Sample Sets for Algebra
INSERT INTO sets (subject_id, title, title_hindi, total_questions, difficulty, is_locked, display_order) VALUES
((SELECT id FROM subjects WHERE name='Algebra'), 'Set 1 - Equations', 'सेट 1 - समीकरण', 5, 'easy', false, 1),
((SELECT id FROM subjects WHERE name='Algebra'), 'Set 2 - Polynomials', 'सेट 2 - बहुपद', 5, 'medium', false, 2);

-- Sample Questions for Physics Set 1
INSERT INTO questions (set_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM sets WHERE title='Set 1 - Basics'),
 'What is the SI unit of force?', 'Joule', 'Newton', 'Watt', 'Pascal', 'B',
 'The SI unit of force is Newton (N), named after Sir Isaac Newton. Force = Mass × Acceleration.', 1),
((SELECT id FROM sets WHERE title='Set 1 - Basics'),
 'What is the speed of light in vacuum?', '3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s', 'B',
 'The speed of light in vacuum is approximately 3×10⁸ meters per second (299,792,458 m/s).', 2),
((SELECT id FROM sets WHERE title='Set 1 - Basics'),
 'Which law states: Every action has an equal and opposite reaction?', "Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravity", 'C',
 "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction.", 3),
((SELECT id FROM sets WHERE title='Set 1 - Basics'),
 'What is the unit of electrical resistance?', 'Ampere', 'Volt', 'Ohm', 'Watt', 'C',
 'The unit of electrical resistance is Ohm (Ω), named after Georg Simon Ohm.', 4),
((SELECT id FROM sets WHERE title='Set 1 - Basics'),
 'What type of energy does a moving object possess?', 'Potential Energy', 'Kinetic Energy', 'Thermal Energy', 'Chemical Energy', 'B',
 'A moving object possesses Kinetic Energy, which is the energy of motion. KE = ½mv².', 5);

-- Sample Questions for Physics Set 2
INSERT INTO questions (set_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM sets WHERE title='Set 2 - Mechanics'),
 'What is acceleration due to gravity on Earth?', '9.8 m/s²', '10.8 m/s²', '8.9 m/s²', '11.2 m/s²', 'A',
 'The acceleration due to gravity on Earth is approximately 9.8 m/s².', 1),
((SELECT id FROM sets WHERE title='Set 2 - Mechanics'),
 'Which instrument measures speed of a vehicle?', 'Thermometer', 'Speedometer', 'Barometer', 'Ammeter', 'B',
 'A speedometer measures the instantaneous speed of a vehicle.', 2),
((SELECT id FROM sets WHERE title='Set 2 - Mechanics'),
 'What is the formula for momentum?', 'p = mv', 'p = ma', 'p = mgh', 'p = ½mv²', 'A',
 'Momentum (p) = Mass (m) × Velocity (v). It is a vector quantity.', 3),
((SELECT id FROM sets WHERE title='Set 2 - Mechanics'),
 'Friction always acts in which direction?', 'Direction of motion', 'Opposite to motion', 'Perpendicular to motion', 'Upward', 'B',
 'Friction always opposes the relative motion between two surfaces in contact.', 4),
((SELECT id FROM sets WHERE title='Set 2 - Mechanics'),
 'What is the work done when force is perpendicular to displacement?', 'Maximum', 'Minimum', 'Zero', 'Infinite', 'C',
 'Work done W = Fd cos θ. When θ = 90°, cos 90° = 0, so work done is zero.', 5);

-- Sample Questions for History Set 1
INSERT INTO questions (set_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM sets WHERE title='Set 1 - Ancient India'),
 'Who founded the Maurya Empire?', 'Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Brihadratha', 'B',
 'Chandragupta Maurya founded the Maurya Empire in 322 BCE with the help of Chanakya.', 1),
((SELECT id FROM sets WHERE title='Set 1 - Ancient India'),
 'The Indus Valley Civilization was discovered in which year?', '1921', '1911', '1931', '1901', 'A',
 'The Indus Valley Civilization was discovered in 1921. Harappa was discovered first, followed by Mohenjo-daro.', 2),
((SELECT id FROM sets WHERE title='Set 1 - Ancient India'),
 'Who wrote the Arthashastra?', 'Megasthenes', 'Kautilya/Chanakya', 'Banabhatta', 'Kalidasa', 'B',
 'Arthashastra was written by Kautilya (also known as Chanakya). It is a treatise on statecraft.', 3),
((SELECT id FROM sets WHERE title='Set 1 - Ancient India'),
 'Which ruler converted to Buddhism after the Kalinga War?', 'Bindusara', 'Ashoka', 'Chandragupta', 'Harsha', 'B',
 'Emperor Ashoka converted to Buddhism after the devastating Kalinga War (261 BCE).', 4),
((SELECT id FROM sets WHERE title='Set 1 - Ancient India'),
 'What was the main occupation of the Indus Valley people?', 'Agriculture', 'Trade', 'Hunting', 'Fishing', 'A',
 'Agriculture was the main occupation of the Indus Valley Civilization people.', 5);

-- Sample Questions for Algebra Set 1
INSERT INTO questions (set_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM sets WHERE title='Set 1 - Equations'),
 'If 2x + 5 = 15, what is x?', '5', '10', '7', '8', 'A',
 '2x + 5 = 15 → 2x = 10 → x = 5', 1),
((SELECT id FROM sets WHERE title='Set 1 - Equations'),
 'What is the value of (a+b)²?', 'a²+b²', 'a²+2ab+b²', 'a²-2ab+b²', '2a+2b', 'B',
 '(a+b)² = a² + 2ab + b². This is a standard algebraic identity.', 2),
((SELECT id FROM sets WHERE title='Set 1 - Equations'),
 'If x = 3, what is 3x² - 2x + 1?', '22', '25', '20', '18', 'A',
 '3(3²) - 2(3) + 1 = 27 - 6 + 1 = 22', 3),
((SELECT id FROM sets WHERE title='Set 1 - Equations'),
 'What is the solution of x² - 9 = 0?', 'x = 3', 'x = -3', 'x = ±3', 'x = 9', 'C',
 'x² = 9 → x = ±3. Both 3 and -3 satisfy the equation.', 4),
((SELECT id FROM sets WHERE title='Set 1 - Equations'),
 'What is the degree of a quadratic equation?', '1', '2', '3', '0', 'B',
 'A quadratic equation has degree 2, as the highest power of the variable is 2.', 5);

-- Update Sections
INSERT INTO update_sections (title, icon_url, display_order) VALUES
('Latest Notifications', '🔔', 1),
('Exam Updates', '📋', 2),
('Admit Card / Results', '🎫', 3);

-- Update Items
INSERT INTO update_items (section_id, title, subtitle, status, published_date, display_order) VALUES
((SELECT id FROM update_sections WHERE title='Latest Notifications'), 'New Syllabus Released', 'Updated for 2025-26 session', 'released', CURRENT_DATE, 1),
((SELECT id FROM update_sections WHERE title='Latest Notifications'), 'Holiday Notice', 'Summer vacation from May 1', 'open', CURRENT_DATE, 2),
((SELECT id FROM update_sections WHERE title='Exam Updates'), 'Exam Date Extended', 'New dates to be announced soon', 'coming_soon', CURRENT_DATE, 1),
((SELECT id FROM update_sections WHERE title='Exam Updates'), 'Mock Test Schedule', 'Starting from next Monday', 'open', CURRENT_DATE, 2),
((SELECT id FROM update_sections WHERE title='Admit Card / Results'), 'Admit Card Available', 'Download your admit card now', 'released', CURRENT_DATE, 1),
((SELECT id FROM update_sections WHERE title='Admit Card / Results'), 'Results Declared', 'Check your results', 'released', CURRENT_DATE - 5, 2);

-- Update Buttons
INSERT INTO update_buttons (item_id, label, button_type, url, display_order) VALUES
((SELECT id FROM update_items WHERE title='New Syllabus Released'), 'View Syllabus', 'link', '/syllabus', 1),
((SELECT id FROM update_items WHERE title='Admit Card Available'), 'Download', 'link', '#', 1),
((SELECT id FROM update_items WHERE title='Results Declared'), 'Check Results', 'link', '#', 1),
((SELECT id FROM update_items WHERE title='Mock Test Schedule'), 'Start Practice', 'link', '#', 1),
((SELECT id FROM update_items WHERE title='Exam Date Extended'), 'Notify Me', 'action', 'notify', 1);

-- Notifications
INSERT INTO notifications (title, message, notification_type, priority) VALUES
('Welcome to EduQuiz Pro!', 'Start your learning journey with our comprehensive MCQ tests.', 'info', 'medium'),
('New Daily Test Available', 'Todays daily test is now live. Take it before midnight!', 'reminder', 'high'),
('Mock Test Results Updated', 'Your mock test results have been updated. Check the leaderboard.', 'update', 'medium'),
('Syllabus Updated', 'New chapters have been added to the Science syllabus.', 'announcement', 'medium'),
('App Maintenance', 'Scheduled maintenance on Sunday 2AM-4AM IST.', 'info', 'low');

-- Daily Tests
INSERT INTO daily_tests (course_id, test_date, language, total_questions, duration_minutes, is_locked, allow_retake) VALUES
((SELECT id FROM courses WHERE name='Daily GK Test'), CURRENT_DATE - 4, 'english', 5, 10, false, true),
((SELECT id FROM courses WHERE name='Daily GK Test'), CURRENT_DATE - 3, 'english', 5, 10, false, true),
((SELECT id FROM courses WHERE name='Daily GK Test'), CURRENT_DATE - 2, 'hindi', 5, 10, false, true),
((SELECT id FROM courses WHERE name='Daily GK Test'), CURRENT_DATE - 1, 'english', 5, 10, false, true),
((SELECT id FROM courses WHERE name='Daily GK Test'), CURRENT_DATE, 'english', 5, 10, false, false);

-- Daily Questions for today's test
INSERT INTO daily_questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM daily_tests ORDER BY test_date DESC LIMIT 1),
 'What is the capital of India?', 'Mumbai', 'New Delhi', 'Kolkata', 'Chennai', 'B',
 'New Delhi is the capital of India.', 1),
((SELECT id FROM daily_tests ORDER BY test_date DESC LIMIT 1),
 'Which planet is known as the Red Planet?', 'Venus', 'Jupiter', 'Mars', 'Saturn', 'C',
 'Mars is called the Red Planet due to its reddish appearance.', 2),
((SELECT id FROM daily_tests ORDER BY test_date DESC LIMIT 1),
 'Who is the Father of the Nation in India?', 'Jawaharlal Nehru', 'Subhas Chandra Bose', 'Mahatma Gandhi', 'Sardar Patel', 'C',
 'Mahatma Gandhi is known as the Father of the Nation in India.', 3),
((SELECT id FROM daily_tests ORDER BY test_date DESC LIMIT 1),
 'What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 'D',
 'The Pacific Ocean is the largest and deepest ocean on Earth.', 4),
((SELECT id FROM daily_tests ORDER BY test_date DESC LIMIT 1),
 'In which year did India gain independence?', '1945', '1947', '1950', '1942', 'B',
 'India gained independence on August 15, 1947.', 5);

-- Mock Tests
INSERT INTO mock_tests (course_id, title, description, total_questions, duration_minutes, full_mock, shuffle_questions, allow_retake) VALUES
((SELECT id FROM courses WHERE name='Full Mock Test'), 'General Knowledge Mock - 1', 'Full mock test covering all GK topics', 10, 20, true, true, true),
((SELECT id FROM courses WHERE name='Full Mock Test'), 'Science Mock - 1', 'Full mock test for Science subjects', 10, 20, true, true, true);

-- Mock Questions for GK Mock
INSERT INTO mock_questions (mock_test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'What is the national flower of India?', 'Rose', 'Lotus', 'Sunflower', 'Jasmine', 'B', 'Lotus is the national flower of India.', 1),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'Which is the longest river in India?', 'Yamuna', 'Godavari', 'Ganga', 'Brahmaputra', 'C', 'The Ganga is the longest river in India (2525 km).', 2),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'Who wrote the Indian National Anthem?', 'Bankim Chandra', 'Rabindranath Tagore', 'Sarojini Naidu', 'Mahatma Gandhi', 'B', 'Jana Gana Mana was written by Rabindranath Tagore.', 3),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'What is the currency of Japan?', 'Yuan', 'Won', 'Yen', 'Ringgit', 'C', 'The currency of Japan is Yen.', 4),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'Which gas is most abundant in Earths atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen', 'C', 'Nitrogen makes up about 78% of Earths atmosphere.', 5),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'What is the largest continent?', 'Africa', 'Asia', 'Europe', 'North America', 'B', 'Asia is the largest continent by both area and population.', 6),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'Who invented the telephone?', 'Edison', 'Bell', 'Marconi', 'Tesla', 'B', 'Alexander Graham Bell invented the telephone in 1876.', 7),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'What is the chemical symbol for Gold?', 'Go', 'Gd', 'Au', 'Ag', 'C', 'Au (from Latin Aurum) is the chemical symbol for Gold.', 8),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'How many states are in India?', '28', '29', '30', '27', 'A', 'India has 28 states.', 9),
((SELECT id FROM mock_tests WHERE title='General Knowledge Mock - 1'),
 'Which planet is closest to the Sun?', 'Venus', 'Mercury', 'Mars', 'Earth', 'B', 'Mercury is the closest planet to the Sun.', 10);

-- Mock Questions for Science Mock
INSERT INTO mock_questions (mock_test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, display_order) VALUES
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the chemical formula of water?', 'H₂O₂', 'CO₂', 'H₂O', 'NaCl', 'C', 'Water is H₂O - two hydrogen atoms and one oxygen atom.', 1),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body', 'B', 'Mitochondria is called the powerhouse of the cell as it produces ATP.', 2),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What gas do plants absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'C', 'Plants absorb CO₂ during photosynthesis to produce food.', 3),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the pH of pure water?', '0', '7', '14', '1', 'B', 'Pure water has a pH of 7, which is neutral.', 4),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'Which organ pumps blood in the human body?', 'Brain', 'Lungs', 'Heart', 'Liver', 'C', 'The heart pumps blood throughout the body via the circulatory system.', 5),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the boiling point of water in Celsius?', '100°C', '90°C', '110°C', '80°C', 'A', 'Water boils at 100°C (212°F) at standard atmospheric pressure.', 6),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'Which vitamin is produced when skin is exposed to sunlight?', 'Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D', 'D', 'Vitamin D is synthesized in the skin when exposed to UV rays from sunlight.', 7),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the hardest natural substance?', 'Iron', 'Diamond', 'Gold', 'Platinum', 'B', 'Diamond is the hardest known natural substance.', 8),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'Sound cannot travel through which medium?', 'Air', 'Water', 'Vacuum', 'Steel', 'C', 'Sound needs a medium to travel. It cannot travel through vacuum.', 9),
((SELECT id FROM mock_tests WHERE title='Science Mock - 1'),
 'What is the smallest unit of matter?', 'Molecule', 'Atom', 'Electron', 'Proton', 'B', 'The atom is the smallest unit of matter that retains chemical properties.', 10);

-- Previous Papers
INSERT INTO previous_papers (course_id, exam_year, exam_month, title, description, is_downloadable) VALUES
((SELECT id FROM courses WHERE name='General Knowledge'), 2024, 'March', 'GK Annual Exam 2024', 'Annual examination paper for General Knowledge', true),
((SELECT id FROM courses WHERE name='General Knowledge'), 2024, 'September', 'GK Half-Yearly 2024', 'Half-yearly examination paper', true),
((SELECT id FROM courses WHERE name='Science'), 2024, 'March', 'Science Annual Exam 2024', 'Annual examination for Science', true),
((SELECT id FROM courses WHERE name='Science'), 2023, 'March', 'Science Annual Exam 2023', 'Previous year paper', true),
((SELECT id FROM courses WHERE name='Mathematics'), 2024, 'March', 'Maths Annual Exam 2024', 'Annual examination for Mathematics', true);

-- Syllabus items
INSERT INTO syllabus (course_id, title, description, file_type, file_url, badge_color, badge_text) VALUES
((SELECT id FROM courses WHERE name='Science'), 'Physics Syllabus 2025', 'Complete physics syllabus', 'pdf', '#', '#ef4444', 'Updated'),
((SELECT id FROM courses WHERE name='Science'), 'Chemistry Lab Manual', 'Chemistry practical guide', 'pdf', '#', '#f97316', 'New'),
((SELECT id FROM courses WHERE name='Science'), 'Biology NCERT', 'NCERT Biology textbook', 'link', 'https://ncert.nic.in', '#22c55e', 'Free'),
((SELECT id FROM courses WHERE name='General Knowledge'), 'GK Complete Guide', 'Comprehensive GK guide', 'pdf', '#', '#3b82f6', 'Popular'),
((SELECT id FROM courses WHERE name='General Knowledge'), 'Current Affairs Monthly', 'Monthly current affairs digest', 'link', '#', '#8b5cf6', 'Latest'),
((SELECT id FROM courses WHERE name='Mathematics'), 'Maths Formula Sheet', 'All important formulas', 'pdf', '#', '#ec4899', 'Must Read');
