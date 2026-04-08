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

CREATE TABLE IF NOT EXISTS update_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  icon_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
