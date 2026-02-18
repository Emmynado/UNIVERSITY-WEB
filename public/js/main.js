async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function setActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

async function loadOverview() {
  const statsGrid = document.getElementById('stats-grid');
  const linksContainer = document.getElementById('quick-links');
  if (!statsGrid || !linksContainer) return;

  const { data } = await fetchJson('/api/v1/overview');
  statsGrid.innerHTML = Object.entries(data.stats)
    .map(([key, value]) => `
      <article class="card">
        <div class="stat">${value.toLocaleString()}</div>
        <div>${key}</div>
      </article>
    `)
    .join('');

  linksContainer.innerHTML = data.quickLinks
    .map((link) => `<a class="badge" href="${link.path}">${link.label}</a>`)
    .join('');
}

async function loadDepartments() {
  const container = document.getElementById('departments-list');
  if (!container) return;

  const { data } = await fetchJson('/api/v1/departments');
  container.innerHTML = data
    .map(
      (department) => `
      <article class="card">
        <h3>${department.name}</h3>
        <p><strong>Head:</strong> ${department.head}</p>
        <p><strong>Programs:</strong></p>
        <ul class="list">
          ${department.programs.map((program) => `<li>${program}</li>`).join('')}
        </ul>
      </article>
    `
    )
    .join('');
}

async function loadAnnouncements() {
  const container = document.getElementById('announcements-list');
  if (!container) return;

  const { data } = await fetchJson('/api/v1/announcements');
  container.innerHTML = data
    .map(
      (announcement) => `
      <article class="card">
        <span class="badge">${announcement.category}</span>
        <h3>${announcement.title}</h3>
        <p>${announcement.body}</p>
        <small>${announcement.date}</small>
      </article>
    `
    )
    .join('');
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const alertContainer = document.getElementById('form-alert');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      fullName: form.fullName.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value
    };

    try {
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok) {
        alertContainer.className = 'alert alert-error';
        alertContainer.textContent = json.errors ? json.errors.join(' ') : json.message;
        return;
      }

      alertContainer.className = 'alert alert-success';
      alertContainer.textContent = 'Thank you! Your message has been submitted.';
      form.reset();
    } catch (_error) {
      alertContainer.className = 'alert alert-error';
      alertContainer.textContent = 'Unable to submit request at this time.';
    }
  });
}

function initSecurityTrainingPanel() {
  const trainingList = document.getElementById('training-list');
  if (!trainingList) return;

  const secureScenarios = [
    {
      pattern: 'Input Validation',
      insecureExample: 'Accepting unchecked input and directly reflecting it to HTML.',
      securePractice: 'Validate and sanitize input server-side and escape output contextually.'
    },
    {
      pattern: 'Authentication',
      insecureExample: 'Using weak default credentials and missing lockout policy.',
      securePractice: 'Use adaptive MFA, strong password policy, and centralized identity governance.'
    },
    {
      pattern: 'Access Control',
      insecureExample: 'Trusting role claims from client-side state.',
      securePractice: 'Enforce RBAC/ABAC authorization on every server endpoint.'
    },
    {
      pattern: 'Database Security',
      insecureExample: 'Building SQL by string concatenation.',
      securePractice: 'Use parameterized queries and least-privileged service accounts.'
    }
  ];

  trainingList.innerHTML = secureScenarios
    .map(
      (item) => `
      <tr>
        <td>${item.pattern}</td>
        <td>${item.insecureExample}</td>
        <td>${item.securePractice}</td>
      </tr>
    `
    )
    .join('');
}

async function bootstrap() {
  setActiveNav();
  await Promise.allSettled([loadOverview(), loadDepartments(), loadAnnouncements()]);
  initContactForm();
  initSecurityTrainingPanel();
}

bootstrap();
