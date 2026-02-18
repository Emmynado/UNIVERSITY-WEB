function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const departments = [
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    head: 'Dr. Meera Kapoor',
    programs: ['B.Tech CSE', 'M.Tech AI', 'Ph.D. Computer Science']
  },
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    head: 'Dr. Rohan Singh',
    programs: ['B.Tech ECE', 'M.Tech Embedded Systems', 'Ph.D. VLSI']
  },
  {
    id: 'mba',
    name: 'School of Management',
    head: 'Dr. Anjali Verma',
    programs: ['BBA', 'MBA', 'Executive MBA']
  }
];

const announcements = [
  {
    id: makeId('ann'),
    title: 'Admissions Open for 2026',
    category: 'Admissions',
    body: 'Applications are now open for undergraduate and postgraduate programs. Last date: 30 June 2026.',
    date: '2026-01-18'
  },
  {
    id: makeId('ann'),
    title: 'International Research Symposium',
    category: 'Research',
    body: 'Join global researchers for the annual symposium on sustainable technology and policy.',
    date: '2026-02-02'
  },
  {
    id: makeId('ann'),
    title: 'Placement Drive Week',
    category: 'Careers',
    body: 'Top companies are visiting campus for final and internship placements.',
    date: '2026-02-10'
  }
];

const faculty = [
  { id: makeId('fac'), name: 'Dr. Meera Kapoor', departmentId: 'cse', email: 'meera.kapoor@university.edu', specialization: 'Machine Learning' },
  { id: makeId('fac'), name: 'Dr. Rohan Singh', departmentId: 'ece', email: 'rohan.singh@university.edu', specialization: 'Signal Processing' },
  { id: makeId('fac'), name: 'Dr. Kavita Sharma', departmentId: 'mba', email: 'kavita.sharma@university.edu', specialization: 'Finance and Risk' }
];

const contacts = [];

module.exports = {
  departments,
  announcements,
  faculty,
  contacts
};
