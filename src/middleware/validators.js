function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactPayload(payload) {
  const { fullName, email, subject, message } = payload || {};
  const errors = [];

  if (!fullName || fullName.trim().length < 3) {
    errors.push('Full name must be at least 3 characters long.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!subject || subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long.');
  }

  if (!message || message.trim().length < 15) {
    errors.push('Message must be at least 15 characters long.');
  }

  return errors;
}

module.exports = {
  validateContactPayload
};
