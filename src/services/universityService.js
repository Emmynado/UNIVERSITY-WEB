const db = require('../data/mockDb');

function getOverview() {
  return {
    universityName: 'National Institute of Advanced Studies',
    tagline: 'Excellence in Education, Research, and Innovation',
    stats: {
      students: 18450,
      faculty: 1120,
      departments: db.departments.length,
      activePrograms: db.departments.reduce((sum, dept) => sum + dept.programs.length, 0)
    },
    quickLinks: [
      { label: 'Admissions', path: '/admissions' },
      { label: 'Departments', path: '/departments' },
      { label: 'Research', path: '/research' },
      { label: 'Student Life', path: '/student-life' },
      { label: 'Contact', path: '/contact' }
    ]
  };
}

function listDepartments() {
  return db.departments;
}

function getDepartmentById(id) {
  return db.departments.find((dept) => dept.id === id);
}

function listAnnouncements() {
  return [...db.announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function listFaculty() {
  return db.faculty;
}

function addContactSubmission(payload) {
  const entry = {
    id: `msg_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString()
  };

  db.contacts.push(entry);
  return entry;
}

function listContactSubmissions() {
  return db.contacts;
}

module.exports = {
  getOverview,
  listDepartments,
  getDepartmentById,
  listAnnouncements,
  listFaculty,
  addContactSubmission,
  listContactSubmissions
};
