const form = document.querySelector('#form');
const eventCardsContainer = document.querySelector('#eventCards');
const clearAllBtn = document.querySelector('#clearAllBtn');
const addSampleBtn = document.querySelector('#addSampleBtn');
const pressedOutput = document.getElementById('pressedOutput');
const emptyMsg = document.querySelector('.empty-msg');


function createEventCard({ title, date, category, description }) {
  const card = document.createElement('div');
  card.className = 'event-card';


  card.innerHTML = `
    <button class="delete-btn" title="Delete">×</button>
    <h3>${escapeHtml(title)}</h3>
    ${date ? `<p>📅 ${escapeHtml(date)}</p>` : ''}
    <span class="category-pill">${escapeHtml(category)}</span>
    ${description ? `<p>${escapeHtml(description)}</p>` : ''}
  `;

  return card;
}

function escapeHtml(text = '') {
  return text.replace(/[&<>"']/g, (m) => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[m]));
}


form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const title = document.querySelector('#EventTitle').value.trim();
  const date = document.querySelector('#EventDate').value;
  const category = document.querySelector('#Category').value;
  const description = document.querySelector('#Description').value.trim();

  if (!title) {
    alert('Please enter an Event Title');
    return;
  }

  const card = createEventCard({ title, date, category, description });
  eventCardsContainer.appendChild(card);

  if (emptyMsg) emptyMsg.style.display = 'none';

  form.reset();
});


eventCardsContainer.addEventListener('click', (e) => {
  const target = e.target;
  if (target.matches('.delete-btn')) {
    const card = target.closest('.event-card');
    if (card) card.remove();

    if (eventCardsContainer.children.length === 0 && emptyMsg) {
      emptyMsg.style.display = 'block';
    }
  }
});

clearAllBtn.addEventListener('click', () => {
  eventCardsContainer.innerHTML = '';
  if (emptyMsg) emptyMsg.style.display = 'block';
});

addSampleBtn.addEventListener('click', () => {
  const samples = [
    { title: 'Tech Meetup', date: '2026-01-22', category: 'Meetup', description: 'Networking session' },
    { title: 'Social Night', date: '2026-02-10', category: 'Social', description: 'Fun evening event' },
    { title: 'Webinar: JS Deep Dive', date: '2026-03-01', category: 'Webinar', description: 'async + promises' },
  ];

  samples.forEach((s) => {
    const card = createEventCard(s);
    eventCardsContainer.appendChild(card);
  });

  if (emptyMsg) emptyMsg.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
  if (pressedOutput) pressedOutput.textContent = `You pressed: ${e.key}`;
});