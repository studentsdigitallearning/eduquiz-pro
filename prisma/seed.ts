import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ────────────────────────────────────────────
  // 1. Site Settings
  // ────────────────────────────────────────────
  console.log('→ Creating site settings...');
  await db.siteSettings.upsert({
    where: { id: 'settings_001' },
    update: {},
    create: {
      id: 'settings_001',
      siteName: 'EduQuiz Pro',
      logoUrl: '/images/logo.png',
      faviconUrl: '/images/favicon.ico',
      metaTitle: 'EduQuiz Pro - Premium Learning & Practice App',
      metaDescription: 'Practice MCQs, daily tests, mock exams, previous papers and stay updated with latest exam notifications.',
      contactEmail: 'support@eduquizpro.com',
      contactPhone: '+91-9876543210',
      whatsappLink: 'https://wa.me/919876543210',
      telegramLink: 'https://t.me/eduquizpro',
      rateAppEnabled: true,
    },
  });

  // ────────────────────────────────────────────
  // 2. Categories
  // ────────────────────────────────────────────
  console.log('→ Creating categories...');
  const mcqCat = await db.category.create({
    data: {
      id: 'cat_mcq',
      title: 'MCQ Practice',
      description: 'Practice MCQ questions across various subjects',
      iconUrl: '📝',
      iconType: 'emoji',
      categoryType: 'mcq',
      colorCode: '#ef4444',
      displayOrder: 1,
      isActive: true,
    },
  });

  const syllabusCat = await db.category.create({
    data: {
      id: 'cat_syllabus',
      title: 'Syllabus',
      description: 'View and download study materials and syllabus',
      iconUrl: '📚',
      iconType: 'emoji',
      categoryType: 'syllabus',
      colorCode: '#f97316',
      displayOrder: 2,
      isActive: true,
    },
  });

  const updatesCat = await db.category.create({
    data: {
      id: 'cat_updates',
      title: 'Updates',
      description: 'Latest notifications and exam updates',
      iconUrl: '📰',
      iconType: 'emoji',
      categoryType: 'updates',
      colorCode: '#eab308',
      displayOrder: 3,
      isActive: true,
    },
  });

  const dailyTestCat = await db.category.create({
    data: {
      id: 'cat_daily_test',
      title: 'Daily Test',
      description: 'Take daily quizzes and track your progress',
      iconUrl: '📅',
      iconType: 'emoji',
      categoryType: 'daily_test',
      colorCode: '#22c55e',
      displayOrder: 4,
      isActive: true,
      isNew: true,
    },
  });

  const dailyResultCat = await db.category.create({
    data: {
      id: 'cat_daily_result',
      title: 'Daily Result',
      description: 'Check your daily test results and rankings',
      iconUrl: '🏆',
      iconType: 'emoji',
      categoryType: 'daily_result',
      colorCode: '#06b6d4',
      displayOrder: 5,
      isActive: true,
    },
  });

  const prevPapersCat = await db.category.create({
    data: {
      id: 'cat_previous_papers',
      title: 'Previous Papers',
      description: 'Solve previous year exam papers',
      iconUrl: '📄',
      iconType: 'emoji',
      categoryType: 'previous_papers',
      colorCode: '#3b82f6',
      displayOrder: 6,
      isActive: true,
    },
  });

  const mockTestCat = await db.category.create({
    data: {
      id: 'cat_mock_test',
      title: 'Mock Test',
      description: 'Full-length mock tests for thorough practice',
      iconUrl: '🎯',
      iconType: 'emoji',
      categoryType: 'mock_test',
      colorCode: '#8b5cf6',
      displayOrder: 7,
      isActive: true,
      isNew: true,
    },
  });

  const jobsCat = await db.category.create({
    data: {
      id: 'cat_jobs',
      title: 'Jobs',
      description: 'Find latest job openings and career opportunities',
      iconUrl: '💼',
      iconType: 'emoji',
      categoryType: 'jobs',
      colorCode: '#ec4899',
      displayOrder: 8,
      isActive: true,
    },
  });

  // ────────────────────────────────────────────
  // 3. Courses
  // ────────────────────────────────────────────
  console.log('→ Creating courses...');

  // MCQ Courses
  const gkCourse = await db.course.create({
    data: { id: 'course_gk', categoryId: mcqCat.id, name: 'General Knowledge', description: 'Practice general knowledge questions', courseCode: 'GK', displayOrder: 1 },
  });
  const scienceCourse = await db.course.create({
    data: { id: 'course_science', categoryId: mcqCat.id, name: 'Science', description: 'Physics, Chemistry, Biology MCQs', courseCode: 'SCI', displayOrder: 2 },
  });
  const mathCourse = await db.course.create({
    data: { id: 'course_math', categoryId: mcqCat.id, name: 'Mathematics', description: 'Mathematics MCQ practice', courseCode: 'MATH', displayOrder: 3 },
  });

  // Syllabus Courses
  const sscSyllabus = await db.course.create({
    data: { id: 'course_ssc_syllabus', categoryId: syllabusCat.id, name: 'SSC Syllabus', description: 'SSC exam syllabus and study materials', courseCode: 'SSC-SYL', displayOrder: 1 },
  });
  const bankSyllabus = await db.course.create({
    data: { id: 'course_bank_syllabus', categoryId: syllabusCat.id, name: 'Banking Syllabus', description: 'Banking exam syllabus and materials', courseCode: 'BANK-SYL', displayOrder: 2 },
  });
  const railwaySyllabus = await db.course.create({
    data: { id: 'course_railway_syllabus', categoryId: syllabusCat.id, name: 'Railway Syllabus', description: 'Railway exam syllabus and materials', courseCode: 'RAIL-SYL', displayOrder: 3 },
  });

  // Daily Test Courses
  const dtGeneral = await db.course.create({
    data: { id: 'course_dt_general', categoryId: dailyTestCat.id, name: 'Daily General Quiz', description: 'General knowledge daily tests', courseCode: 'DT-GEN', displayOrder: 1 },
  });

  // Mock Test Courses
  const mtSsc = await db.course.create({
    data: { id: 'course_mt_ssc', categoryId: mockTestCat.id, name: 'SSC Mock Tests', description: 'Full-length SSC mock exams', courseCode: 'MT-SSC', displayOrder: 1 },
  });

  // Previous Papers Courses
  const ppSsc = await db.course.create({
    data: { id: 'course_pp_ssc', categoryId: prevPapersCat.id, name: 'SSC Previous Papers', description: 'Previous year SSC question papers', courseCode: 'PP-SSC', displayOrder: 1 },
  });

  // Jobs Courses
  const jobGovt = await db.course.create({
    data: { id: 'course_jobs_govt', categoryId: jobsCat.id, name: 'Government Jobs', description: 'Latest government job notifications', courseCode: 'JOB-GOV', displayOrder: 1 },
  });

  // Updates Courses
  const updatesNotif = await db.course.create({
    data: { id: 'course_updates_main', categoryId: updatesCat.id, name: 'All Updates', description: 'All exam-related updates', courseCode: 'UPD', displayOrder: 1 },
  });

  // Daily Result Courses
  const dailyResultCourse = await db.course.create({
    data: { id: 'course_daily_result', categoryId: dailyResultCat.id, name: 'Daily Test Results', description: 'View daily test results and rankings', courseCode: 'DR', displayOrder: 1 },
  });

  // ────────────────────────────────────────────
  // 4. Subjects
  // ────────────────────────────────────────────
  console.log('→ Creating subjects...');

  // GK Subjects
  const history = await db.subject.create({
    data: { id: 'sub_history', courseId: gkCourse.id, name: 'Indian History', nameHindi: 'भारत का इतिहास', subjectCode: 'HIST', displayOrder: 1 },
  });
  const geography = await db.subject.create({
    data: { id: 'sub_geography', courseId: gkCourse.id, name: 'World Geography', nameHindi: 'विश्व भूगोल', subjectCode: 'GEOG', displayOrder: 2 },
  });
  const polity = await db.subject.create({
    data: { id: 'sub_polity', courseId: gkCourse.id, name: 'Indian Polity', nameHindi: 'भारतीय राजनीति', subjectCode: 'POL', displayOrder: 3 },
  });

  // Science Subjects
  const physics = await db.subject.create({
    data: { id: 'sub_physics', courseId: scienceCourse.id, name: 'Physics', nameHindi: 'भौतिक विज्ञान', subjectCode: 'PHY', displayOrder: 1 },
  });
  const chemistry = await db.subject.create({
    data: { id: 'sub_chemistry', courseId: scienceCourse.id, name: 'Chemistry', nameHindi: 'रसायन विज्ञान', subjectCode: 'CHEM', displayOrder: 2 },
  });
  const biology = await db.subject.create({
    data: { id: 'sub_biology', courseId: scienceCourse.id, name: 'Biology', nameHindi: 'जीव विज्ञान', subjectCode: 'BIO', displayOrder: 3 },
  });

  // Math Subjects
  const algebra = await db.subject.create({
    data: { id: 'sub_algebra', courseId: mathCourse.id, name: 'Algebra', nameHindi: 'बीजगणित', subjectCode: 'ALG', displayOrder: 1 },
  });
  const geometry = await db.subject.create({
    data: { id: 'sub_geometry', courseId: mathCourse.id, name: 'Geometry', nameHindi: 'ज्यामिति', subjectCode: 'GEO', displayOrder: 2 },
  });
  const arithmetic = await db.subject.create({
    data: { id: 'sub_arithmetic', courseId: mathCourse.id, name: 'Arithmetic', nameHindi: 'अंकगणित', subjectCode: 'ARI', displayOrder: 3 },
  });

  // ────────────────────────────────────────────
  // 5. Sets (3-4 per subject)
  // ────────────────────────────────────────────
  console.log('→ Creating sets...');

  // History Sets
  const histSet1 = await db.set.create({
    data: { id: 'set_hist_1', subjectId: history.id, title: 'Ancient India', titleHindi: 'प्राचीन भारत', description: 'Questions about ancient Indian civilization', totalQuestions: 10, durationMinutes: 10, difficulty: 'easy', displayOrder: 1 },
  });
  const histSet2 = await db.set.create({
    data: { id: 'set_hist_2', subjectId: history.id, title: 'Medieval India', titleHindi: 'मध्यकालीन भारत', description: 'Medieval Indian history questions', totalQuestions: 10, durationMinutes: 10, difficulty: 'medium', displayOrder: 2 },
  });
  const histSet3 = await db.set.create({
    data: { id: 'set_hist_3', subjectId: history.id, title: 'Modern India', titleHindi: 'आधुनिक भारत', description: 'Modern Indian history and freedom struggle', totalQuestions: 10, durationMinutes: 15, difficulty: 'hard', displayOrder: 3, unlockType: 'ad_based' },
  });

  // Geography Sets
  const geoSet1 = await db.set.create({
    data: { id: 'set_geo_1', subjectId: geography.id, title: 'Indian Geography', titleHindi: 'भारत का भूगोल', description: 'Geography of India', totalQuestions: 10, durationMinutes: 10, difficulty: 'easy', displayOrder: 1 },
  });
  const geoSet2 = await db.set.create({
    data: { id: 'set_geo_2', subjectId: geography.id, title: 'World Geography', titleHindi: 'विश्व भूगोल', description: 'World geography basics', totalQuestions: 8, durationMinutes: 8, difficulty: 'medium', displayOrder: 2 },
  });

  // Polity Sets
  const polSet1 = await db.set.create({
    data: { id: 'set_pol_1', subjectId: polity.id, title: 'Constitution Basics', titleHindi: 'संविधान मूल बातें', description: 'Fundamental rights and duties', totalQuestions: 10, durationMinutes: 10, difficulty: 'easy', displayOrder: 1 },
  });

  // Physics Sets
  const phySet1 = await db.set.create({
    data: { id: 'set_phy_1', subjectId: physics.id, title: 'Mechanics Basics', titleHindi: 'यांत्रिकी मूल बातें', description: 'Laws of motion, force, energy', totalQuestions: 10, durationMinutes: 12, difficulty: 'easy', displayOrder: 1 },
  });
  const phySet2 = await db.set.create({
    data: { id: 'set_phy_2', subjectId: physics.id, title: 'Optics & Waves', titleHindi: 'प्रकाशिकी और तरंगें', description: 'Light, sound, and wave theory', totalQuestions: 8, durationMinutes: 10, difficulty: 'medium', displayOrder: 2 },
  });

  // Chemistry Sets
  const chemSet1 = await db.set.create({
    data: { id: 'set_chem_1', subjectId: chemistry.id, title: 'Organic Chemistry', titleHindi: 'कार्बनिक रसायन', description: 'Hydrocarbons and functional groups', totalQuestions: 10, durationMinutes: 10, difficulty: 'medium', displayOrder: 1 },
  });

  // Biology Sets
  const bioSet1 = await db.set.create({
    data: { id: 'set_bio_1', subjectId: biology.id, title: 'Human Body', titleHindi: 'मानव शरीर', description: 'Anatomy and physiology basics', totalQuestions: 10, durationMinutes: 10, difficulty: 'easy', displayOrder: 1 },
  });

  // Math Sets
  const algSet1 = await db.set.create({
    data: { id: 'set_alg_1', subjectId: algebra.id, title: 'Equations', titleHindi: 'समीकरण', description: 'Linear and quadratic equations', totalQuestions: 10, durationMinutes: 15, difficulty: 'easy', displayOrder: 1 },
  });
  const geoSetM = await db.set.create({
    data: { id: 'set_geomm_1', subjectId: geometry.id, title: 'Shapes & Areas', titleHindi: 'आकृतियां और क्षेत्रफल', description: '2D and 3D geometry', totalQuestions: 8, durationMinutes: 12, difficulty: 'medium', displayOrder: 1 },
  });

  // ────────────────────────────────────────────
  // 6. Questions (5-10 per set)
  // ────────────────────────────────────────────
  console.log('→ Creating questions...');

  // History Set 1 - Ancient India
  await db.question.createMany({
    data: [
      { id: 'q_h1_1', setId: histSet1.id, questionText: 'The Indus Valley Civilization was discovered in which year?', optionA: '1921', optionB: '1925', optionC: '1930', optionD: '1935', correctAnswer: 'A', explanation: 'The Indus Valley Civilization was discovered in 1921 by Daya Ram Sahni at Harappa.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_h1_2', setId: histSet1.id, questionText: 'Who wrote the Arthashastra?', optionA: 'Megasthenes', optionB: 'Kautilya', optionC: 'Banabhatta', optionD: 'Kalidasa', correctAnswer: 'B', explanation: 'Arthashastra was written by Kautilya (Chanakya), the advisor of Chandragupta Maurya.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_h1_3', setId: histSet1.id, questionText: 'The Great Bath was found in which archaeological site?', optionA: 'Harappa', optionB: 'Lothal', optionC: 'Mohenjo-daro', optionD: 'Kalibangan', correctAnswer: 'C', explanation: 'The Great Bath is one of the most famous structures of the Indus Valley Civilization, found at Mohenjo-daro.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_h1_4', setId: histSet1.id, questionText: 'Ashoka belonged to which dynasty?', optionA: 'Gupta Dynasty', optionB: 'Nanda Dynasty', optionC: 'Maurya Dynasty', optionD: 'Kushan Dynasty', correctAnswer: 'C', explanation: 'Emperor Ashoka belonged to the Maurya Dynasty and was the grandson of Chandragupta Maurya.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_h1_5', setId: histSet1.id, questionText: 'Which Veda is the oldest?', optionA: 'Yajurveda', optionB: 'Samaveda', optionC: 'Atharvaveda', optionD: 'Rigveda', correctAnswer: 'D', explanation: 'Rigveda is the oldest Veda, composed around 1500 BCE. It contains hymns dedicated to various deities.', difficulty: 'easy', displayOrder: 5 },
      { id: 'q_h1_6', setId: histSet1.id, questionText: 'The Kalinga War was fought in which year?', optionA: '261 BC', optionB: '269 BC', optionC: '255 BC', optionD: '273 BC', correctAnswer: 'A', explanation: 'The Kalinga War was fought in 261 BC. After this war, Ashoka embraced Buddhism.', difficulty: 'medium', displayOrder: 6 },
      { id: 'q_h1_7', setId: histSet1.id, questionText: 'Pataliputra was the capital of which empire?', optionA: 'Gupta Empire', optionB: 'Maurya Empire', optionC: 'Chola Empire', optionD: 'Chalukya Empire', correctAnswer: 'B', explanation: 'Pataliputra (modern-day Patna) was the capital of the Maurya Empire.', difficulty: 'easy', displayOrder: 7 },
      { id: 'q_h1_8', setId: histSet1.id, questionText: 'Who built the Sanchi Stupa?', optionA: 'Ashoka', optionB: 'Chandragupta', optionC: 'Harsha', optionD: 'Kanishka', correctAnswer: 'A', explanation: 'The Sanchi Stupa was originally built by Emperor Ashoka in the 3rd century BCE.', difficulty: 'easy', displayOrder: 8 },
      { id: 'q_h1_9', setId: histSet1.id, questionText: 'The first Buddhist Council was held at?', optionA: 'Vaishali', optionB: 'Pataliputra', optionC: 'Rajagriha', optionD: 'Kashmir', correctAnswer: 'C', explanation: 'The first Buddhist Council was held at Rajagriha shortly after the death of Buddha.', difficulty: 'medium', displayOrder: 9 },
      { id: 'q_h1_10', setId: histSet1.id, questionText: 'Chanakya was the minister of which king?', optionA: 'Ashoka', optionB: 'Chandragupta Maurya', optionC: 'Bindusara', optionD: 'Harsha', correctAnswer: 'B', explanation: 'Chanakya (Kautilya) served as the minister and advisor of Chandragupta Maurya.', difficulty: 'easy', displayOrder: 10 },
    ],
  });

  // History Set 2 - Medieval India
  await db.question.createMany({
    data: [
      { id: 'q_h2_1', setId: histSet2.id, questionText: 'Who founded the Mughal Empire in India?', optionA: 'Akbar', optionB: 'Humayun', optionC: 'Babur', optionD: 'Shah Jahan', correctAnswer: 'C', explanation: 'Babur founded the Mughal Empire in India after winning the First Battle of Panipat in 1526.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_h2_2', setId: histSet2.id, questionText: 'The Battle of Plassey was fought in which year?', optionA: '1757', optionB: '1764', optionC: '1857', optionD: '1761', correctAnswer: 'A', explanation: 'The Battle of Plassey was fought in 1757 between the British East India Company and Siraj-ud-Daulah.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_h2_3', setId: histSet2.id, questionText: 'Who built the Taj Mahal?', optionA: 'Akbar', optionB: 'Jahangir', optionC: 'Shah Jahan', optionD: 'Aurangzeb', correctAnswer: 'C', explanation: 'The Taj Mahal was built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_h2_4', setId: histSet2.id, questionText: 'Rajput kingdoms were mainly located in which region?', optionA: 'South India', optionB: 'North India', optionC: 'East India', optionD: 'West India', correctAnswer: 'B', explanation: 'Rajput kingdoms were primarily located in the northwestern and central parts of India, mainly in Rajasthan.', difficulty: 'medium', displayOrder: 4 },
      { id: 'q_h2_5', setId: histSet2.id, questionText: 'The Vijayanagara Empire was founded in which year?', optionA: '1336', optionB: '1346', optionC: '1356', optionD: '1326', correctAnswer: 'A', explanation: 'The Vijayanagara Empire was founded in 1336 by Harihara I and Bukka Raya I.', difficulty: 'medium', displayOrder: 5 },
      { id: 'q_h2_6', setId: histSet2.id, questionText: 'Alauddin Khilji introduced which tax system?', optionA: 'Jizya', optionB: 'Zakat', optionC: 'Kharaj', optionD: 'Chauth', correctAnswer: 'A', explanation: 'Alauddin Khilji re-imposed the Jizya tax on non-Muslims and also introduced market reforms.', difficulty: 'hard', displayOrder: 6 },
      { id: 'q_h2_7', setId: histSet2.id, questionText: 'The Battle of Haldighati was fought between?', optionA: 'Akbar and Rana Sanga', optionB: 'Akbar and Maharana Pratap', optionC: 'Babur and Rana Sanga', optionD: 'Humayun and Sher Shah', correctAnswer: 'B', explanation: 'The Battle of Haldighati was fought in 1576 between Akbar\'s forces led by Man Singh and Maharana Pratap.', difficulty: 'easy', displayOrder: 7 },
    ],
  });

  // Geography Set 1
  await db.question.createMany({
    data: [
      { id: 'q_g1_1', setId: geoSet1.id, questionText: 'Which is the longest river in India?', optionA: 'Godavari', optionB: 'Ganga', optionC: 'Krishna', optionD: 'Brahmaputra', correctAnswer: 'B', explanation: 'The Ganga is the longest river in India, flowing about 2,525 km from Gangotri to Bay of Bengal.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_g1_2', setId: geoSet1.id, questionText: 'Which state has the largest area in India?', optionA: 'Madhya Pradesh', optionB: 'Maharashtra', optionC: 'Rajasthan', optionD: 'Uttar Pradesh', correctAnswer: 'C', explanation: 'Rajasthan is the largest state by area in India, covering 342,239 sq km.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_g1_3', setId: geoSet1.id, questionText: 'The Tropic of Cancer passes through how many Indian states?', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', explanation: 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, WB, Tripura, and Mizoram.', difficulty: 'medium', displayOrder: 3 },
      { id: 'q_g1_4', setId: geoSet1.id, questionText: 'Which is the highest peak in India?', optionA: 'Mount Everest', optionB: 'Kanchenjunga', optionC: 'K2 (Godwin Austen)', optionD: 'Nanda Devi', correctAnswer: 'C', explanation: 'K2 (8,611m) in PoK is technically the highest peak in India. In undisputed territory, Kangchenjunga (8,586m) is the highest.', difficulty: 'hard', displayOrder: 4 },
      { id: 'q_g1_5', setId: geoSet1.id, questionText: 'Which Indian state receives the highest rainfall?', optionA: 'Kerala', optionB: 'Assam', optionC: 'Meghalaya', optionD: 'Sikkim', correctAnswer: 'C', explanation: 'Meghalaya receives the highest rainfall in India. Mawsynram in Meghalaya is the wettest place on Earth.', difficulty: 'easy', displayOrder: 5 },
      { id: 'q_g1_6', setId: geoSet1.id, questionText: 'The Deccan Plateau is bordered by which mountain ranges?', optionA: 'Himalayas and Vindhyas', optionB: 'Western and Eastern Ghats', optionC: 'Satpura and Aravalli', optionD: 'Nilgiri and Cardamom', correctAnswer: 'B', explanation: 'The Deccan Plateau is bordered by the Western Ghats on the west and Eastern Ghats on the east.', difficulty: 'medium', displayOrder: 6 },
      { id: 'q_g1_7', setId: geoSet1.id, questionText: 'Which is the largest desert in India?', optionA: 'Cold Desert (Ladakh)', optionB: 'Thar Desert', optionC: 'Rann of Kutch', optionD: 'Deccan Desert', correctAnswer: 'B', explanation: 'The Thar Desert (Great Indian Desert) is the largest desert in India, located in Rajasthan.', difficulty: 'easy', displayOrder: 7 },
      { id: 'q_g1_8', setId: geoSet1.id, questionText: 'Which river forms the boundary between India and Pakistan?', optionA: 'Ganga', optionB: 'Yamuna', optionC: 'Indus', optionD: 'Brahmaputra', correctAnswer: 'C', explanation: 'The Indus River flows through India and Pakistan and forms part of the international boundary.', difficulty: 'easy', displayOrder: 8 },
      { id: 'q_g1_9', setId: geoSet1.id, questionText: 'The Andaman and Nicobar Islands are located in which sea?', optionA: 'Arabian Sea', optionB: 'Indian Ocean', optionC: 'Bay of Bengal', optionD: 'South China Sea', correctAnswer: 'C', explanation: 'The Andaman and Nicobar Islands are located in the Bay of Bengal.', difficulty: 'easy', displayOrder: 9 },
      { id: 'q_g1_10', setId: geoSet1.id, questionText: 'Which is the southernmost point of mainland India?', optionA: 'Indira Point', optionB: 'Kanyakumari', optionC: 'Cape Comorin', optionD: 'Minicoy Island', correctAnswer: 'B', explanation: 'Kanyakumari (Cape Comorin) is the southernmost point of mainland India. Indira Point is the southernmost of the entire country.', difficulty: 'easy', displayOrder: 10 },
    ],
  });

  // Polity Set 1
  await db.question.createMany({
    data: [
      { id: 'q_p1_1', setId: polSet1.id, questionText: 'The Indian Constitution was adopted on?', optionA: '15 Aug 1947', optionB: '26 Jan 1950', optionC: '26 Nov 1949', optionD: '2 Oct 1950', correctAnswer: 'C', explanation: 'The Indian Constitution was adopted on 26 November 1949 and came into effect on 26 January 1950.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_p1_2', setId: polSet1.id, questionText: 'How many Fundamental Rights are guaranteed by the Indian Constitution?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctAnswer: 'B', explanation: 'The Indian Constitution guarantees 6 Fundamental Rights: Equality, Freedom, Against Exploitation, Religion, Cultural & Educational, and Constitutional Remedies.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_p1_3', setId: polSet1.id, questionText: 'Who is known as the Father of the Indian Constitution?', optionA: 'Jawaharlal Nehru', optionB: 'Mahatma Gandhi', optionC: 'B.R. Ambedkar', optionD: 'Sardar Patel', correctAnswer: 'C', explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution as he was the Chairman of the Drafting Committee.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_p1_4', setId: polSet1.id, questionText: 'The concept of Fundamental Duties was borrowed from which constitution?', optionA: 'USA', optionB: 'USSR', optionC: 'UK', optionD: 'France', correctAnswer: 'B', explanation: 'The concept of Fundamental Duties was borrowed from the Constitution of the USSR (now Russia).', difficulty: 'medium', displayOrder: 4 },
      { id: 'q_p1_5', setId: polSet1.id, questionText: 'Which Article of the Indian Constitution deals with the Right to Equality?', optionA: 'Article 14-18', optionB: 'Article 19-22', optionC: 'Article 23-24', optionD: 'Article 25-28', correctAnswer: 'A', explanation: 'Articles 14-18 of the Indian Constitution deal with the Right to Equality.', difficulty: 'medium', displayOrder: 5 },
      { id: 'q_p1_6', setId: polSet1.id, questionText: 'The Supreme Court of India is located in?', optionA: 'Mumbai', optionB: 'Kolkata', optionC: 'New Delhi', optionD: 'Chennai', correctAnswer: 'C', explanation: 'The Supreme Court of India is located in New Delhi on Tilak Marg.', difficulty: 'easy', displayOrder: 6 },
      { id: 'q_p1_7', setId: polSet1.id, questionText: 'Who appoints the Chief Justice of India?', optionA: 'Prime Minister', optionB: 'President', optionC: 'Parliament', optionD: 'Law Minister', correctAnswer: 'B', explanation: 'The Chief Justice of India is appointed by the President of India.', difficulty: 'easy', displayOrder: 7 },
      { id: 'q_p1_8', setId: polSet1.id, questionText: 'How many schedules are there in the Indian Constitution?', optionA: '8', optionB: '10', optionC: '12', optionD: '14', correctAnswer: 'C', explanation: 'There are 12 schedules in the Indian Constitution originally, now after amendments there are 12.', difficulty: 'medium', displayOrder: 8 },
    ],
  });

  // Physics Set 1
  await db.question.createMany({
    data: [
      { id: 'q_ph1_1', setId: phySet1.id, questionText: 'Newton\'s first law of motion is also known as?', optionA: 'Law of Acceleration', optionB: 'Law of Inertia', optionC: 'Law of Action-Reaction', optionD: 'Law of Gravity', correctAnswer: 'B', explanation: 'Newton\'s first law is called the Law of Inertia — a body at rest stays at rest unless acted upon by an external force.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_ph1_2', setId: phySet1.id, questionText: 'What is the SI unit of force?', optionA: 'Joule', optionB: 'Watt', optionC: 'Newton', optionD: 'Pascal', correctAnswer: 'C', explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_ph1_3', setId: phySet1.id, questionText: 'The acceleration due to gravity on Earth is approximately?', optionA: '8.9 m/s²', optionB: '9.8 m/s²', optionC: '10.8 m/s²', optionD: '11.2 m/s²', correctAnswer: 'B', explanation: 'The standard acceleration due to gravity on Earth is approximately 9.8 m/s².', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_ph1_4', setId: phySet1.id, questionText: 'Which law states: "For every action, there is an equal and opposite reaction"?', optionA: 'Newton\'s First Law', optionB: 'Newton\'s Second Law', optionC: 'Newton\'s Third Law', optionD: 'Law of Conservation', correctAnswer: 'C', explanation: 'Newton\'s Third Law of Motion states that for every action, there is an equal and opposite reaction.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_ph1_5', setId: phySet1.id, questionText: 'What is the formula for kinetic energy?', optionA: 'mgh', optionB: '½mv²', optionC: 'Fd', optionD: 'mv', correctAnswer: 'B', explanation: 'Kinetic energy = ½mv², where m is mass and v is velocity.', difficulty: 'medium', displayOrder: 5 },
      { id: 'q_ph1_6', setId: phySet1.id, questionText: 'The escape velocity from Earth is approximately?', optionA: '7.9 km/s', optionB: '11.2 km/s', optionC: '15.0 km/s', optionD: '9.8 km/s', correctAnswer: 'B', explanation: 'The escape velocity from Earth is approximately 11.2 km/s (about 40,320 km/h).', difficulty: 'medium', displayOrder: 6 },
      { id: 'q_ph1_7', setId: phySet1.id, questionText: 'What is the SI unit of work?', optionA: 'Newton', optionB: 'Watt', optionC: 'Joule', optionD: 'Pascal', correctAnswer: 'C', explanation: 'The SI unit of work is Joule (J). 1 Joule = 1 Newton × 1 meter.', difficulty: 'easy', displayOrder: 7 },
      { id: 'q_ph1_8', setId: phySet1.id, questionText: 'Which of these is a vector quantity?', optionA: 'Speed', optionB: 'Mass', optionC: 'Temperature', optionD: 'Velocity', correctAnswer: 'D', explanation: 'Velocity is a vector quantity as it has both magnitude and direction. Speed is a scalar quantity.', difficulty: 'easy', displayOrder: 8 },
    ],
  });

  // Chemistry Set 1
  await db.question.createMany({
    data: [
      { id: 'q_ch1_1', setId: chemSet1.id, questionText: 'What is the chemical formula of water?', optionA: 'H₂O₂', optionB: 'HO₂', optionC: 'H₂O', optionD: 'OH', correctAnswer: 'C', explanation: 'The chemical formula of water is H₂O, consisting of two hydrogen atoms and one oxygen atom.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_ch1_2', setId: chemSet1.id, questionText: 'Which element has the atomic number 1?', optionA: 'Helium', optionB: 'Oxygen', optionC: 'Carbon', optionD: 'Hydrogen', correctAnswer: 'D', explanation: 'Hydrogen has the atomic number 1. It is the lightest and most abundant element in the universe.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_ch1_3', setId: chemSet1.id, questionText: 'What is the pH value of pure water?', optionA: '0', optionB: '5', optionC: '7', optionD: '14', correctAnswer: 'C', explanation: 'Pure water has a pH of 7, which is considered neutral — neither acidic nor basic.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_ch1_4', setId: chemSet1.id, questionText: 'Which gas is released during photosynthesis?', optionA: 'Carbon Dioxide', optionB: 'Nitrogen', optionC: 'Oxygen', optionD: 'Hydrogen', correctAnswer: 'C', explanation: 'Oxygen is released during photosynthesis. Plants absorb CO₂ and release O₂.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_ch1_5', setId: chemSet1.id, questionText: 'What is the chemical symbol for Gold?', optionA: 'Go', optionB: 'Gd', optionC: 'Au', optionD: 'Ag', correctAnswer: 'C', explanation: 'The chemical symbol for Gold is Au, derived from the Latin word "Aurum".', difficulty: 'easy', displayOrder: 5 },
      { id: 'q_ch1_6', setId: chemSet1.id, questionText: 'Which is the hardest naturally occurring substance?', optionA: 'Quartz', optionB: 'Diamond', optionC: 'Topaz', optionD: 'Corundum', correctAnswer: 'B', explanation: 'Diamond is the hardest naturally occurring substance, scoring 10 on the Mohs hardness scale.', difficulty: 'easy', displayOrder: 6 },
      { id: 'q_ch1_7', setId: chemSet1.id, questionText: 'The chemical formula of common salt is?', optionA: 'NaO', optionB: 'NaCl', optionC: 'KCl', optionD: 'CaCl₂', correctAnswer: 'B', explanation: 'Common salt (sodium chloride) has the chemical formula NaCl.', difficulty: 'easy', displayOrder: 7 },
    ],
  });

  // Biology Set 1
  await db.question.createMany({
    data: [
      { id: 'q_b1_1', setId: bioSet1.id, questionText: 'What is the largest organ in the human body?', optionA: 'Liver', optionB: 'Brain', optionC: 'Skin', optionD: 'Heart', correctAnswer: 'C', explanation: 'The skin is the largest organ of the human body, covering about 1.5 to 2 square meters.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_b1_2', setId: bioSet1.id, questionText: 'How many bones are there in an adult human body?', optionA: '196', optionB: '206', optionC: '216', optionD: '306', correctAnswer: 'B', explanation: 'An adult human body has 206 bones. Babies are born with about 270 bones, many of which fuse as they grow.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_b1_3', setId: bioSet1.id, questionText: 'Which blood group is known as the universal donor?', optionA: 'A+', optionB: 'B+', optionC: 'AB+', optionD: 'O-', correctAnswer: 'D', explanation: 'Blood group O- is the universal donor as it can be transfused to patients of any blood group.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_b1_4', setId: bioSet1.id, questionText: 'The powerhouse of the cell is called?', optionA: 'Nucleus', optionB: 'Ribosome', optionC: 'Mitochondria', optionD: 'Golgi Body', correctAnswer: 'C', explanation: 'Mitochondria are called the powerhouse of the cell as they produce energy in the form of ATP.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_b1_5', setId: bioSet1.id, questionText: 'What is the normal body temperature of a human?', optionA: '35°C', optionB: '36.5°C', optionC: '37°C', optionD: '38°C', correctAnswer: 'C', explanation: 'The normal body temperature of a human is approximately 37°C (98.6°F).', difficulty: 'easy', displayOrder: 5 },
      { id: 'q_b1_6', setId: bioSet1.id, questionText: 'Which vitamin is produced when the skin is exposed to sunlight?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin D', correctAnswer: 'D', explanation: 'Vitamin D is produced in the skin when exposed to ultraviolet B (UVB) radiation from sunlight.', difficulty: 'easy', displayOrder: 6 },
    ],
  });

  // Algebra Set 1
  await db.question.createMany({
    data: [
      { id: 'q_a1_1', setId: algSet1.id, questionText: 'If x + 5 = 12, what is x?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctAnswer: 'C', explanation: 'x + 5 = 12 → x = 12 - 5 = 7', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_a1_2', setId: algSet1.id, questionText: 'What is the value of 2x + 3 when x = 4?', optionA: '8', optionB: '10', optionC: '11', optionD: '12', correctAnswer: 'C', explanation: '2(4) + 3 = 8 + 3 = 11', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_a1_3', setId: algSet1.id, questionText: 'Solve: 3x - 7 = 14', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctAnswer: 'C', explanation: '3x = 14 + 7 = 21 → x = 21/3 = 7', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_a1_4', setId: algSet1.id, questionText: 'What is the square root of 144?', optionA: '10', optionB: '11', optionC: '12', optionD: '14', correctAnswer: 'C', explanation: '√144 = 12, since 12 × 12 = 144', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_a1_5', setId: algSet1.id, questionText: 'If a = 2 and b = 3, what is a² + b²?', optionA: '11', optionB: '12', optionC: '13', optionD: '25', correctAnswer: 'C', explanation: 'a² + b² = 2² + 3² = 4 + 9 = 13', difficulty: 'easy', displayOrder: 5 },
      { id: 'q_a1_6', setId: algSet1.id, questionText: 'The sum of angles in a triangle is?', optionA: '90°', optionB: '180°', optionC: '270°', optionD: '360°', correctAnswer: 'B', explanation: 'The sum of the three interior angles of any triangle is always 180°.', difficulty: 'easy', displayOrder: 6 },
    ],
  });

  // Geography Set 2 (World Geography)
  await db.question.createMany({
    data: [
      { id: 'q_g2_1', setId: geoSet2.id, questionText: 'Which is the largest ocean in the world?', optionA: 'Atlantic Ocean', optionB: 'Indian Ocean', optionC: 'Arctic Ocean', optionD: 'Pacific Ocean', correctAnswer: 'D', explanation: 'The Pacific Ocean is the largest and deepest ocean, covering about 63 million square miles.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_g2_2', setId: geoSet2.id, questionText: 'Which is the longest river in the world?', optionA: 'Amazon', optionB: 'Nile', optionC: 'Mississippi', optionD: 'Yangtze', correctAnswer: 'B', explanation: 'The Nile River in Africa is the longest river in the world, approximately 6,650 km long.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_g2_3', setId: geoSet2.id, questionText: 'Which is the smallest country in the world by area?', optionA: 'Monaco', optionB: 'San Marino', optionC: 'Vatican City', optionD: 'Liechtenstein', correctAnswer: 'C', explanation: 'Vatican City is the smallest country in the world by both area and population.', difficulty: 'medium', displayOrder: 3 },
      { id: 'q_g2_4', setId: geoSet2.id, questionText: 'Mount Everest is located in which mountain range?', optionA: 'Andes', optionB: 'Alps', optionC: 'Himalayas', optionD: 'Rockies', correctAnswer: 'C', explanation: 'Mount Everest, the highest peak in the world (8,849m), is located in the Himalayas.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_g2_5', setId: geoSet2.id, questionText: 'Which continent has the most countries?', optionA: 'Asia', optionB: 'Europe', optionC: 'Africa', optionD: 'South America', correctAnswer: 'C', explanation: 'Africa has 54 recognized countries, the most of any continent.', difficulty: 'medium', displayOrder: 5 },
    ],
  });

  // History Set 3 - Modern India
  await db.question.createMany({
    data: [
      { id: 'q_h3_1', setId: histSet3.id, questionText: 'Who started the Quit India Movement?', optionA: 'Subhash Chandra Bose', optionB: 'Jawaharlal Nehru', optionC: 'Mahatma Gandhi', optionD: 'Sardar Patel', correctAnswer: 'C', explanation: 'Mahatma Gandhi launched the Quit India Movement on 8 August 1942 at the Bombay session of AICC.', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_h3_2', setId: histSet3.id, questionText: 'The Jallianwala Bagh Massacre took place in which year?', optionA: '1917', optionB: '1919', optionC: '1921', optionD: '1922', correctAnswer: 'B', explanation: 'The Jallianwala Bagh Massacre took place on 13 April 1919 in Amritsar, Punjab.', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_h3_3', setId: histSet3.id, questionText: 'Who founded the Indian National Congress?', optionA: 'A.O. Hume', optionB: 'Dadabhai Naoroji', optionC: 'W.C. Bonnerjee', optionD: 'G.K. Gokhale', correctAnswer: 'A', explanation: 'The Indian National Congress was founded in 1885 by Allan Octavian Hume.', difficulty: 'medium', displayOrder: 3 },
      { id: 'q_h3_4', setId: histSet3.id, questionText: 'The Non-Cooperation Movement was launched in which year?', optionA: '1919', optionB: '1920', optionC: '1921', optionD: '1922', correctAnswer: 'B', explanation: 'The Non-Cooperation Movement was launched by Mahatma Gandhi in 1920.', difficulty: 'medium', displayOrder: 4 },
      { id: 'q_h3_5', setId: histSet3.id, questionText: 'Who was the first Governor-General of independent India?', optionA: 'Lord Mountbatten', optionB: 'C. Rajagopalachari', optionC: 'Jawaharlal Nehru', optionD: 'Dr. Rajendra Prasad', correctAnswer: 'A', explanation: 'Lord Mountbatten was the first Governor-General of independent India (1947-1948).', difficulty: 'easy', displayOrder: 5 },
    ],
  });

  // Physics Set 2
  await db.question.createMany({
    data: [
      { id: 'q_ph2_1', setId: phySet2.id, questionText: 'The speed of light in vacuum is approximately?', optionA: '3 × 10⁶ m/s', optionB: '3 × 10⁸ m/s', optionC: '3 × 10¹⁰ m/s', optionD: '3 × 10⁵ m/s', correctAnswer: 'B', explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s (299,792,458 m/s).', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_ph2_2', setId: phySet2.id, questionText: 'Which type of lens is used to correct myopia?', optionA: 'Convex lens', optionB: 'Concave lens', optionC: 'Bifocal lens', optionD: 'Cylindrical lens', correctAnswer: 'B', explanation: 'Myopia (nearsightedness) is corrected using concave (diverging) lenses.', difficulty: 'medium', displayOrder: 2 },
      { id: 'q_ph2_3', setId: phySet2.id, questionText: 'What is the unit of frequency?', optionA: 'Watt', optionB: 'Hertz', optionC: 'Pascal', optionD: 'Newton', correctAnswer: 'B', explanation: 'Frequency is measured in Hertz (Hz). One Hertz equals one cycle per second.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_ph2_4', setId: phySet2.id, questionText: 'Sound cannot travel through?', optionA: 'Air', optionB: 'Water', optionC: 'Vacuum', optionD: 'Steel', correctAnswer: 'C', explanation: 'Sound requires a medium to travel and cannot propagate through vacuum.', difficulty: 'easy', displayOrder: 4 },
      { id: 'q_ph2_5', setId: phySet2.id, questionText: 'The phenomenon of light bending when it passes from one medium to another is called?', optionA: 'Reflection', optionB: 'Diffraction', optionC: 'Refraction', optionD: 'Dispersion', correctAnswer: 'C', explanation: 'Refraction is the bending of light when it passes from one transparent medium to another.', difficulty: 'medium', displayOrder: 5 },
    ],
  });

  // Geometry Math Set
  await db.question.createMany({
    data: [
      { id: 'q_gm1_1', setId: geoSetM.id, questionText: 'What is the area of a circle with radius 7 cm?', optionA: '144 cm²', optionB: '154 cm²', optionC: '22 cm²', optionD: '44 cm²', correctAnswer: 'B', explanation: 'Area of circle = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²', difficulty: 'easy', displayOrder: 1 },
      { id: 'q_gm1_2', setId: geoSetM.id, questionText: 'What is the perimeter of a rectangle with length 10 cm and width 6 cm?', optionA: '16 cm', optionB: '60 cm²', optionC: '32 cm', optionD: '20 cm', correctAnswer: 'C', explanation: 'Perimeter of rectangle = 2(l + w) = 2(10 + 6) = 2 × 16 = 32 cm', difficulty: 'easy', displayOrder: 2 },
      { id: 'q_gm1_3', setId: geoSetM.id, questionText: 'How many degrees are there in a right angle?', optionA: '45°', optionB: '90°', optionC: '180°', optionD: '360°', correctAnswer: 'B', explanation: 'A right angle measures exactly 90 degrees.', difficulty: 'easy', displayOrder: 3 },
      { id: 'q_gm1_4', setId: geoSetM.id, questionText: 'What is the volume of a cube with side 5 cm?', optionA: '25 cm³', optionB: '125 cm³', optionC: '150 cm³', optionD: '100 cm³', correctAnswer: 'B', explanation: 'Volume of cube = side³ = 5³ = 125 cm³', difficulty: 'medium', displayOrder: 4 },
      { id: 'q_gm1_5', setId: geoSetM.id, questionText: 'The circumference of a circle with radius 14 cm is approximately?', optionA: '44 cm', optionB: '88 cm', optionC: '154 cm', optionD: '28 cm', correctAnswer: 'B', explanation: 'Circumference = 2πr = 2 × (22/7) × 14 = 88 cm', difficulty: 'medium', displayOrder: 5 },
      { id: 'q_gm1_6', setId: geoSetM.id, questionText: 'How many sides does a hexagon have?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctAnswer: 'B', explanation: 'A hexagon has 6 sides. "Hexa" means six in Greek.', difficulty: 'easy', displayOrder: 6 },
    ],
  });

  // ────────────────────────────────────────────
  // 7. Update Sections
  // ────────────────────────────────────────────
  console.log('→ Creating update sections...');

  const notifSection = await db.updateSection.create({
    data: { id: 'usec_notif', title: 'Latest Notifications', iconUrl: '🔔', displayOrder: 1 },
  });
  const examSection = await db.updateSection.create({
    data: { id: 'usec_exam', title: 'Exam Updates', iconUrl: '📋', displayOrder: 2 },
  });
  const admitSection = await db.updateSection.create({
    data: { id: 'usec_admit', title: 'Admit Card', iconUrl: '🎫', displayOrder: 3 },
  });

  // Update Items
  await db.updateItem.createMany({
    data: [
      { id: 'uitem_1', sectionId: notifSection.id, title: 'SSC CGL 2024 Notification Released', subtitle: 'Staff Selection Commission', description: 'SSC has released the notification for CGL 2024. Online registration starts from 10th June 2024.', status: 'released', publishedDate: new Date('2024-06-01'), imageUrl: '', displayOrder: 1 },
      { id: 'uitem_2', sectionId: notifSection.id, title: 'RRB NTPC Admit Card 2024', subtitle: 'Railway Recruitment Board', description: 'RRB NTPC admit cards for CBT-2 have been released. Download now from the official website.', status: 'released', publishedDate: new Date('2024-05-28'), imageUrl: '', displayOrder: 2 },
      { id: 'uitem_3', sectionId: examSection.id, title: 'UPSC CSE Prelims 2024', subtitle: 'Union Public Service Commission', description: 'UPSC Civil Services Preliminary Exam 2024 scheduled for 16th June 2024.', status: 'released', publishedDate: new Date('2024-05-15'), imageUrl: '', displayOrder: 1 },
      { id: 'uitem_4', sectionId: examSection.id, title: 'IBPS PO 2024 Notification', subtitle: 'Institute of Banking Personnel Selection', description: 'IBPS PO 2024 notification expected in August 2024. Stay tuned for updates.', status: 'coming_soon', publishedDate: new Date('2024-07-01'), displayOrder: 2 },
      { id: 'uitem_5', sectionId: admitSection.id, title: 'SSC CHSL Tier-I Admit Card', subtitle: 'Download Now', description: 'SSC CHSL Tier-I exam admit cards are now available for download.', status: 'open', publishedDate: new Date('2024-06-05'), imageUrl: '', displayOrder: 1 },
      { id: 'uitem_6', sectionId: admitSection.id, title: 'RBI Grade B Admit Card 2024', subtitle: 'Reserve Bank of India', description: 'RBI Grade B Phase-I admit card to be released soon. Check regularly for updates.', status: 'coming_soon', publishedDate: new Date('2024-07-10'), displayOrder: 2 },
    ],
  });

  // Update Buttons
  await db.updateButton.createMany({
    data: [
      { id: 'ubtn_1', itemId: 'uitem_1', label: 'View Details', buttonType: 'link', url: '#', displayOrder: 1 },
      { id: 'ubtn_2', itemId: 'uitem_1', label: 'Apply Now', buttonType: 'link', url: '#', displayOrder: 2 },
      { id: 'ubtn_3', itemId: 'uitem_2', label: 'Download Admit Card', buttonType: 'link', url: '#', displayOrder: 1 },
      { id: 'ubtn_4', itemId: 'uitem_5', label: 'Download', buttonType: 'link', url: '#', displayOrder: 1 },
      { id: 'ubtn_5', itemId: 'uitem_6', label: 'Notify Me', buttonType: 'action', action: 'subscribe', displayOrder: 1 },
    ],
  });

  // ────────────────────────────────────────────
  // 8. Notifications
  // ────────────────────────────────────────────
  console.log('→ Creating notifications...');
  await db.notification.createMany({
    data: [
      { id: 'notif_1', title: 'Welcome to EduQuiz Pro!', message: 'Start your exam preparation with our comprehensive study materials.', description: 'Practice daily tests, mock exams, and MCQs to ace your exams.', notificationType: 'info', priority: 'high', publishedDate: new Date('2024-01-01') },
      { id: 'notif_2', title: 'Daily Test Available', message: 'New daily test is live! Test your knowledge on General Science.', notificationType: 'reminder', priority: 'medium', publishedDate: new Date('2024-06-15') },
      { id: 'notif_3', title: 'SSC CGL 2024 Update', message: 'SSC CGL 2024 notification has been released. Check exam dates and eligibility.', notificationType: 'update', priority: 'high', publishedDate: new Date('2024-06-01') },
      { id: 'notif_4', title: 'New Mock Test Added', message: 'Full-length SSC CGL Mock Test is now available. Practice now!', notificationType: 'announcement', priority: 'medium', publishedDate: new Date('2024-06-10') },
      { id: 'notif_5', title: 'App Update Available', message: 'We have improved performance and added new features. Update now!', notificationType: 'update', priority: 'low', publishedDate: new Date('2024-06-12') },
    ],
  });

  // ────────────────────────────────────────────
  // 9. Daily Tests with Questions
  // ────────────────────────────────────────────
  console.log('→ Creating daily tests...');

  const dt1 = await db.dailyTest.create({
    data: { id: 'dt_001', courseId: dtGeneral.id, testDate: new Date('2024-06-15'), language: 'hindi', totalQuestions: 5, durationMinutes: 5, unlockType: 'free', allowRetake: false },
  });
  const dt2 = await db.dailyTest.create({
    data: { id: 'dt_002', courseId: dtGeneral.id, testDate: new Date('2024-06-14'), language: 'english', totalQuestions: 5, durationMinutes: 5, unlockType: 'free', allowRetake: true },
  });
  const dt3 = await db.dailyTest.create({
    data: { id: 'dt_003', courseId: dtGeneral.id, testDate: new Date('2024-06-13'), language: 'hindi', totalQuestions: 5, durationMinutes: 5, unlockType: 'ad_based', allowRetake: false },
  });
  const dt4 = await db.dailyTest.create({
    data: { id: 'dt_004', courseId: dtGeneral.id, testDate: new Date('2024-06-12'), language: 'hindi', totalQuestions: 5, durationMinutes: 5, unlockType: 'free', allowRetake: true },
  });
  const dt5 = await db.dailyTest.create({
    data: { id: 'dt_005', courseId: dtGeneral.id, testDate: new Date('2024-06-11'), language: 'english', totalQuestions: 5, durationMinutes: 5, unlockType: 'free', allowRetake: false },
  });

  // Daily Test 1 Questions
  await db.dailyQuestion.createMany({
    data: [
      { id: 'dq1_1', testId: dt1.id, questionText: 'What is the capital of India?', optionA: 'Mumbai', optionB: 'Kolkata', optionC: 'New Delhi', optionD: 'Chennai', correctAnswer: 'C', explanation: 'New Delhi is the capital of India.', displayOrder: 1 },
      { id: 'dq1_2', testId: dt1.id, questionText: 'Who is known as the Father of the Nation in India?', optionA: 'Jawaharlal Nehru', optionB: 'Mahatma Gandhi', optionC: 'Subhash Chandra Bose', optionD: 'Sardar Patel', correctAnswer: 'B', explanation: 'Mahatma Gandhi is known as the Father of the Nation (Bapu).', displayOrder: 2 },
      { id: 'dq1_3', testId: dt1.id, questionText: 'Which planet is closest to the Sun?', optionA: 'Venus', optionB: 'Mars', optionC: 'Mercury', optionD: 'Earth', correctAnswer: 'C', explanation: 'Mercury is the closest planet to the Sun in our solar system.', displayOrder: 3 },
      { id: 'dq1_4', testId: dt1.id, questionText: 'What is the chemical symbol for Iron?', optionA: 'Ir', optionB: 'In', optionC: 'Fe', optionD: 'Io', correctAnswer: 'C', explanation: 'The chemical symbol for Iron is Fe, derived from the Latin word "Ferrum".', displayOrder: 4 },
      { id: 'dq1_5', testId: dt1.id, questionText: 'Which gas makes up most of Earth\'s atmosphere?', optionA: 'Oxygen', optionB: 'Carbon Dioxide', optionC: 'Nitrogen', optionD: 'Hydrogen', correctAnswer: 'C', explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.', displayOrder: 5 },
    ],
  });

  // Daily Test 2 Questions
  await db.dailyQuestion.createMany({
    data: [
      { id: 'dq2_1', testId: dt2.id, questionText: 'The currency of Japan is?', optionA: 'Yuan', optionB: 'Won', optionC: 'Yen', optionD: 'Ringgit', correctAnswer: 'C', explanation: 'The currency of Japan is the Japanese Yen (¥).', displayOrder: 1 },
      { id: 'dq2_2', testId: dt2.id, questionText: 'In which year did India gain independence?', optionA: '1945', optionB: '1947', optionC: '1950', optionD: '1942', correctAnswer: 'B', explanation: 'India gained independence from British rule on 15 August 1947.', displayOrder: 2 },
      { id: 'dq2_3', testId: dt2.id, questionText: 'Which organ pumps blood in the human body?', optionA: 'Lungs', optionB: 'Brain', optionC: 'Heart', optionD: 'Kidney', correctAnswer: 'C', explanation: 'The heart is the organ that pumps blood throughout the body.', displayOrder: 3 },
      { id: 'dq2_4', testId: dt2.id, questionText: 'What is 15% of 200?', optionA: '20', optionB: '25', optionC: '30', optionD: '35', correctAnswer: 'C', explanation: '15% of 200 = (15/100) × 200 = 30', displayOrder: 4 },
      { id: 'dq2_5', testId: dt2.id, questionText: 'The Earth rotates on its axis from?', optionA: 'East to West', optionB: 'West to East', optionC: 'North to South', optionD: 'South to North', correctAnswer: 'B', explanation: 'The Earth rotates from West to East, which is why the Sun appears to rise in the East.', displayOrder: 5 },
    ],
  });

  // Daily Test 3 Questions
  await db.dailyQuestion.createMany({
    data: [
      { id: 'dq3_1', testId: dt3.id, questionText: 'Which is the national animal of India?', optionA: 'Lion', optionB: 'Tiger', optionC: 'Elephant', optionD: 'Peacock', correctAnswer: 'B', explanation: 'The Bengal Tiger is the national animal of India.', displayOrder: 1 },
      { id: 'dq3_2', testId: dt3.id, questionText: 'What is the boiling point of water in Celsius?', optionA: '90°C', optionB: '100°C', optionC: '110°C', optionD: '120°C', correctAnswer: 'B', explanation: 'The boiling point of water at standard atmospheric pressure is 100°C.', displayOrder: 2 },
      { id: 'dq3_3', testId: dt3.id, questionText: 'Who wrote the national anthem of India?', optionA: 'Bankim Chandra', optionB: 'Rabindranath Tagore', optionC: 'Sarojini Naidu', optionD: 'Mahatma Gandhi', correctAnswer: 'B', explanation: '"Jana Gana Mana" was written by Rabindranath Tagore.', displayOrder: 3 },
      { id: 'dq3_4', testId: dt3.id, questionText: 'Which planet is known as the Red Planet?', optionA: 'Jupiter', optionB: 'Venus', optionC: 'Mars', optionD: 'Saturn', correctAnswer: 'C', explanation: 'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide on its surface.', displayOrder: 4 },
      { id: 'dq3_5', testId: dt3.id, questionText: 'How many states are there in India?', optionA: '28', optionB: '29', optionC: '30', optionD: '27', correctAnswer: 'A', explanation: 'India currently has 28 states and 8 Union Territories.', displayOrder: 5 },
    ],
  });

  // Daily Test 4 Questions
  await db.dailyQuestion.createMany({
    data: [
      { id: 'dq4_1', testId: dt4.id, questionText: 'Which is the largest bone in the human body?', optionA: 'Femur', optionB: 'Tibia', optionC: 'Humerus', optionD: 'Skull', correctAnswer: 'A', explanation: 'The femur (thigh bone) is the longest and largest bone in the human body.', displayOrder: 1 },
      { id: 'dq4_2', testId: dt4.id, questionText: 'What is the square of 25?', optionA: '525', optionB: '625', optionC: '675', optionD: '725', correctAnswer: 'B', explanation: '25² = 25 × 25 = 625', displayOrder: 2 },
      { id: 'dq4_3', testId: dt4.id, questionText: 'Which vitamin prevents scurvy?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin D', correctAnswer: 'C', explanation: 'Vitamin C (ascorbic acid) prevents scurvy. Citrus fruits are rich in Vitamin C.', displayOrder: 3 },
      { id: 'dq4_4', testId: dt4.id, questionText: 'The headquarters of UNO is in which city?', optionA: 'London', optionB: 'Paris', optionC: 'New York', optionD: 'Geneva', correctAnswer: 'C', explanation: 'The United Nations headquarters is located in New York City.', displayOrder: 4 },
      { id: 'dq4_5', testId: dt4.id, questionText: 'What is the formula of sulfuric acid?', optionA: 'HCl', optionB: 'HNO₃', optionC: 'H₂SO₄', optionD: 'H₃PO₄', correctAnswer: 'C', explanation: 'The chemical formula of sulfuric acid is H₂SO₄.', displayOrder: 5 },
    ],
  });

  // Daily Test 5 Questions
  await db.dailyQuestion.createMany({
    data: [
      { id: 'dq5_1', testId: dt5.id, questionText: 'Who invented the telephone?', optionA: 'Thomas Edison', optionB: 'Alexander Graham Bell', optionC: 'Nikola Tesla', optionD: 'Albert Einstein', correctAnswer: 'B', explanation: 'Alexander Graham Bell is credited with inventing the telephone in 1876.', displayOrder: 1 },
      { id: 'dq5_2', testId: dt5.id, questionText: 'What is the national flower of India?', optionA: 'Rose', optionB: 'Sunflower', optionC: 'Lotus', optionD: 'Jasmine', correctAnswer: 'C', explanation: 'Lotus (Nelumbo nucifera) is the national flower of India.', displayOrder: 2 },
      { id: 'dq5_3', testId: dt5.id, questionText: 'How many sides does a pentagon have?', optionA: '4', optionB: '5', optionC: '6', optionD: '7', correctAnswer: 'B', explanation: 'A pentagon has 5 sides. "Penta" means five in Greek.', displayOrder: 3 },
      { id: 'dq5_4', testId: dt5.id, questionText: 'Which is the hardest naturally occurring substance?', optionA: 'Gold', optionB: 'Iron', optionC: 'Diamond', optionD: 'Platinum', correctAnswer: 'C', explanation: 'Diamond is the hardest naturally occurring substance.', displayOrder: 4 },
      { id: 'dq5_5', testId: dt5.id, questionText: 'What is 1000 ÷ 25?', optionA: '20', optionB: '25', optionC: '30', optionD: '40', correctAnswer: 'D', explanation: '1000 ÷ 25 = 40', displayOrder: 5 },
    ],
  });

  // ────────────────────────────────────────────
  // 10. Mock Tests with Questions
  // ────────────────────────────────────────────
  console.log('→ Creating mock tests...');

  const mt1 = await db.mockTest.create({
    data: {
      id: 'mt_ssc_001',
      courseId: mtSsc.id,
      title: 'SSC CGL Full Mock Test 1',
      description: 'Comprehensive mock test covering all sections: GK, Reasoning, Math, English',
      totalQuestions: 10,
      durationMinutes: 15,
      fullMock: true,
      shuffleQuestions: true,
      showAnswersAfter: true,
      allowRetake: true,
      displayOrder: 1,
    },
  });

  const mt2 = await db.mockTest.create({
    data: {
      id: 'mt_ssc_002',
      courseId: mtSsc.id,
      title: 'SSC CGL Mini Mock Test',
      description: 'Quick practice test with important questions',
      totalQuestions: 8,
      durationMinutes: 10,
      fullMock: false,
      shuffleQuestions: true,
      showAnswersAfter: true,
      allowRetake: true,
      displayOrder: 2,
    },
  });

  // Mock Test 1 Questions
  await db.mockQuestion.createMany({
    data: [
      { id: 'mq1_1', mockTestId: mt1.id, questionText: 'Who was the first President of India?', optionA: 'Jawaharlal Nehru', optionB: 'Dr. Rajendra Prasad', optionC: 'Sardar Patel', optionD: 'Dr. S. Radhakrishnan', correctAnswer: 'B', explanation: 'Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.', displayOrder: 1 },
      { id: 'mq1_2', mockTestId: mt1.id, questionText: 'What is the LCM of 12 and 18?', optionA: '24', optionB: '36', optionC: '48', optionD: '72', correctAnswer: 'B', explanation: 'LCM of 12 and 18: 12 = 2² × 3, 18 = 2 × 3² → LCM = 2² × 3² = 36', displayOrder: 2 },
      { id: 'mq1_3', mockTestId: mt1.id, questionText: 'Which amendment of the Indian Constitution reduced the voting age from 21 to 18?', optionA: '42nd', optionB: '44th', optionC: '61st', optionD: '73rd', correctAnswer: 'C', explanation: 'The 61st Amendment Act (1988) reduced the voting age from 21 to 18 years.', displayOrder: 3 },
      { id: 'mq1_4', mockTestId: mt1.id, questionText: 'If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?', optionA: '120 km', optionB: '130 km', optionC: '150 km', optionD: '160 km', correctAnswer: 'C', explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km', displayOrder: 4 },
      { id: 'mq1_5', mockTestId: mt1.id, questionText: 'The ozone layer is found in which layer of the atmosphere?', optionA: 'Troposphere', optionB: 'Stratosphere', optionC: 'Mesosphere', optionD: 'Thermosphere', correctAnswer: 'B', explanation: 'The ozone layer is located in the stratosphere, about 15-35 km above Earth.', displayOrder: 5 },
      { id: 'mq1_6', mockTestId: mt1.id, questionText: 'What is the chemical name of Vitamin C?', optionA: 'Ascorbic Acid', optionB: 'Citric Acid', optionC: 'Folic Acid', optionD: 'Retinol', correctAnswer: 'A', explanation: 'Vitamin C is chemically known as Ascorbic Acid.', displayOrder: 6 },
      { id: 'mq1_7', mockTestId: mt1.id, questionText: 'Which Indian state has the highest literacy rate?', optionA: 'Goa', optionB: 'Kerala', optionC: 'Mizoram', optionD: 'Himachal Pradesh', correctAnswer: 'B', explanation: 'Kerala has the highest literacy rate among Indian states, at about 94%.', displayOrder: 7 },
      { id: 'mq1_8', mockTestId: mt1.id, questionText: 'What is the next number in the series: 2, 6, 12, 20, ?', optionA: '28', optionB: '30', optionC: '32', optionD: '36', correctAnswer: 'B', explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30', displayOrder: 8 },
      { id: 'mq1_9', mockTestId: mt1.id, questionText: 'Which is the largest continent by area?', optionA: 'Africa', optionB: 'North America', optionC: 'Asia', optionD: 'Europe', correctAnswer: 'C', explanation: 'Asia is the largest continent by area (about 44.58 million sq km) and by population.', displayOrder: 9 },
      { id: 'mq1_10', mockTestId: mt1.id, questionText: 'The compound interest on Rs. 1000 at 10% per annum for 2 years is?', optionA: 'Rs. 200', optionB: 'Rs. 210', optionC: 'Rs. 220', optionD: 'Rs. 190', correctAnswer: 'B', explanation: 'CI = P(1+r/n)^(nt) - P = 1000(1+0.1)² - 1000 = 1210 - 1000 = Rs. 210', displayOrder: 10 },
    ],
  });

  // Mock Test 2 Questions
  await db.mockQuestion.createMany({
    data: [
      { id: 'mq2_1', mockTestId: mt2.id, questionText: 'What is the currency of the USA?', optionA: 'Pound', optionB: 'Dollar', optionC: 'Euro', optionD: 'Yen', correctAnswer: 'B', explanation: 'The currency of the USA is the US Dollar ($).', displayOrder: 1 },
      { id: 'mq2_2', mockTestId: mt2.id, questionText: 'Which planet is the largest in our solar system?', optionA: 'Saturn', optionB: 'Neptune', optionC: 'Jupiter', optionD: 'Uranus', correctAnswer: 'C', explanation: 'Jupiter is the largest planet in our solar system.', displayOrder: 2 },
      { id: 'mq2_3', mockTestId: mt2.id, questionText: 'The Indian Parliament consists of how many houses?', optionA: 'One', optionB: 'Two', optionC: 'Three', optionD: 'Four', correctAnswer: 'B', explanation: 'The Indian Parliament is bicameral, consisting of Lok Sabha and Rajya Sabha.', displayOrder: 3 },
      { id: 'mq2_4', mockTestId: mt2.id, questionText: 'If 5x = 35, what is x?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctAnswer: 'C', explanation: '5x = 35 → x = 35/5 = 7', displayOrder: 4 },
      { id: 'mq2_5', mockTestId: mt2.id, questionText: 'What is the main component of natural gas?', optionA: 'Propane', optionB: 'Butane', optionC: 'Methane', optionD: 'Ethane', correctAnswer: 'C', explanation: 'Methane (CH₄) is the main component of natural gas, typically 70-90%.', displayOrder: 5 },
      { id: 'mq2_6', mockTestId: mt2.id, questionText: 'In which year was the first Five-Year Plan launched in India?', optionA: '1947', optionB: '1950', optionC: '1951', optionD: '1955', correctAnswer: 'C', explanation: 'The first Five-Year Plan was launched in 1951, based on the Harrod-Domar model.', displayOrder: 6 },
      { id: 'mq2_7', mockTestId: mt2.id, questionText: 'Which blood group is known as the universal recipient?', optionA: 'O+', optionB: 'O-', optionC: 'AB+', optionD: 'AB-', correctAnswer: 'C', explanation: 'Blood group AB+ is the universal recipient as it can accept blood from any group.', displayOrder: 7 },
      { id: 'mq2_8', mockTestId: mt2.id, questionText: 'The World Cup of Cricket was started in which year?', optionA: '1971', optionB: '1975', optionC: '1979', optionD: '1983', correctAnswer: 'B', explanation: 'The ICC Cricket World Cup was first held in 1975 in England.', displayOrder: 8 },
    ],
  });

  // ────────────────────────────────────────────
  // 11. Previous Papers
  // ────────────────────────────────────────────
  console.log('→ Creating previous papers...');
  await db.previousPaper.createMany({
    data: [
      { id: 'pp_1', courseId: ppSsc.id, examYear: 2023, examMonth: 'May', title: 'SSC CGL Tier-I 2023', description: 'SSC CGL Tier-I exam paper held in May 2023', isDownloadable: true, displayOrder: 1 },
      { id: 'pp_2', courseId: ppSsc.id, examYear: 2023, examMonth: 'April', title: 'SSC CHSL Tier-I 2023', description: 'SSC CHSL Tier-I exam paper held in April 2023', isDownloadable: true, displayOrder: 2 },
      { id: 'pp_3', courseId: ppSsc.id, examYear: 2022, examMonth: 'December', title: 'SSC CGL Tier-II 2022', description: 'SSC CGL Tier-II exam paper held in December 2022', isDownloadable: true, displayOrder: 3 },
      { id: 'pp_4', courseId: ppSsc.id, examYear: 2022, examMonth: 'June', title: 'SSC MTS 2022', description: 'SSC MTS exam paper from June 2022 session', isDownloadable: true, displayOrder: 4 },
      { id: 'pp_5', courseId: ppSsc.id, examYear: 2022, examMonth: 'March', title: 'SSC CPO 2022', description: 'SSC CPO Sub-Inspector exam paper from March 2022', isDownloadable: true, displayOrder: 5 },
    ],
  });

  // ────────────────────────────────────────────
  // 12. Syllabus Items
  // ────────────────────────────────────────────
  console.log('→ Creating syllabus items...');
  await db.syllabus.createMany({
    data: [
      { id: 'syl_1', courseId: sscSyllabus.id, title: 'SSC CGL Complete Syllabus 2024', description: 'Complete syllabus for SSC CGL including Tier-I and Tier-II', fileType: 'pdf', fileUrl: '/downloads/ssc-cgl-syllabus.pdf', badgeColor: '#22c55e', badgeText: 'Updated', displayOrder: 1 },
      { id: 'syl_2', courseId: sscSyllabus.id, title: 'SSC CHSL Syllabus', description: 'Detailed syllabus for SSC CHSL exam', fileType: 'pdf', fileUrl: '/downloads/ssc-chsl-syllabus.pdf', badgeColor: '#3b82f6', badgeText: 'PDF', displayOrder: 2 },
      { id: 'syl_3', courseId: bankSyllabus.id, title: 'IBPS PO Syllabus 2024', description: 'Complete IBPS PO exam syllabus with topic-wise weightage', fileType: 'pdf', fileUrl: '/downloads/ibps-po-syllabus.pdf', badgeColor: '#8b5cf6', badgeText: 'Popular', displayOrder: 1 },
      { id: 'syl_4', courseId: bankSyllabus.id, title: 'SBI Clerk Syllabus', description: 'SBI Clerk Prelims and Mains syllabus', fileType: 'link', externalLink: 'https://sbi.co.in', badgeColor: '#06b6d4', badgeText: 'Link', displayOrder: 2 },
      { id: 'syl_5', courseId: railwaySyllabus.id, title: 'RRB NTPC Syllabus', description: 'Railway NTPC CBT syllabus for all stages', fileType: 'pdf', fileUrl: '/downloads/rrb-ntpc-syllabus.pdf', badgeColor: '#ef4444', badgeText: 'Free', displayOrder: 1 },
      { id: 'syl_6', courseId: railwaySyllabus.id, title: 'RRB Group D Syllabus', description: 'Complete RRB Group D exam syllabus', fileType: 'pdf', fileUrl: '/downloads/rrb-groupd-syllabus.pdf', displayOrder: 2 },
    ],
  });

  // ────────────────────────────────────────────
  // 13. Sample User Profiles (for leaderboard demo)
  // ────────────────────────────────────────────
  console.log('→ Creating sample user profiles...');
  await db.userProfile.createMany({
    data: [
      { id: 'user_001', fullName: 'Rahul Kumar', email: 'rahul@example.com', state: 'Delhi', preferredLanguage: 'hindi', totalTestsTaken: 15, totalScore: 680 },
      { id: 'user_002', fullName: 'Priya Sharma', email: 'priya@example.com', state: 'Rajasthan', preferredLanguage: 'hindi', totalTestsTaken: 12, totalScore: 540 },
      { id: 'user_003', fullName: 'Amit Patel', email: 'amit@example.com', state: 'Gujarat', preferredLanguage: 'english', totalTestsTaken: 20, totalScore: 890 },
      { id: 'user_004', fullName: 'Sneha Verma', email: 'sneha@example.com', state: 'MP', preferredLanguage: 'hindi', totalTestsTaken: 8, totalScore: 350 },
      { id: 'user_005', fullName: 'Vikram Singh', email: 'vikram@example.com', state: 'UP', preferredLanguage: 'hindi', totalTestsTaken: 25, totalScore: 1120 },
    ],
  });

  // ────────────────────────────────────────────
  // 14. Sample Results (for leaderboard demo)
  // ────────────────────────────────────────────
  console.log('→ Creating sample results...');
  await db.result.createMany({
    data: [
      { id: 'res_001', userId: 'user_005', testId: dt1.id, testType: 'daily_test', courseId: dtGeneral.id, totalQuestions: 5, correctAnswers: 5, wrongAnswers: 0, skippedAnswers: 0, totalScore: 50, percentage: 100, timeTakenSeconds: 180, rank: 1, status: 'completed', testDate: new Date('2024-06-15') },
      { id: 'res_002', userId: 'user_003', testId: dt1.id, testType: 'daily_test', courseId: dtGeneral.id, totalQuestions: 5, correctAnswers: 4, wrongAnswers: 1, skippedAnswers: 0, totalScore: 39, percentage: 80, timeTakenSeconds: 220, rank: 2, status: 'completed', testDate: new Date('2024-06-15') },
      { id: 'res_003', userId: 'user_001', testId: dt1.id, testType: 'daily_test', courseId: dtGeneral.id, totalQuestions: 5, correctAnswers: 4, wrongAnswers: 0, skippedAnswers: 1, totalScore: 40, percentage: 80, timeTakenSeconds: 200, rank: 3, status: 'completed', testDate: new Date('2024-06-15') },
      { id: 'res_004', userId: 'user_002', testId: dt1.id, testType: 'daily_test', courseId: dtGeneral.id, totalQuestions: 5, correctAnswers: 3, wrongAnswers: 2, skippedAnswers: 0, totalScore: 28, percentage: 60, timeTakenSeconds: 250, rank: 4, status: 'completed', testDate: new Date('2024-06-15') },
      { id: 'res_005', userId: 'user_004', testId: dt1.id, testType: 'daily_test', courseId: dtGeneral.id, totalQuestions: 5, correctAnswers: 2, wrongAnswers: 2, skippedAnswers: 1, totalScore: 18, percentage: 40, timeTakenSeconds: 280, rank: 5, status: 'completed', testDate: new Date('2024-06-15') },
    ],
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('   - 1 site setting');
  console.log('   - 8 categories');
  console.log('   - 12 courses');
  console.log('   - 9 subjects');
  console.log('   - 12 sets');
  console.log('   - 80+ questions (across sets, daily tests, mock tests)');
  console.log('   - 3 update sections with items and buttons');
  console.log('   - 5 notifications');
  console.log('   - 5 daily tests');
  console.log('   - 2 mock tests');
  console.log('   - 5 previous papers');
  console.log('   - 6 syllabus items');
  console.log('   - 5 user profiles');
  console.log('   - 5 sample results');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
