/* =========================================================
   EduVora — script.js
   ========================================================= */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. COURSE DATA (in-memory database)
     --------------------------------------------------------- */
  const courses = [
    {
      id: 'python',
      title: 'Python Programming Fundamentals',
      category: 'Programming',
      level: 'Beginner',
      instructor: 'Dr. Meera Rao',
      minutes: 240,
      description: 'Learn Python from scratch: syntax, variables, loops, functions, and your first projects.',
      url: 'https://www.youtube.com/embed/rfscVS0vtbw',
      lessons: ['Setting up Python', 'Variables & Types', 'Control Flow', 'Functions', 'Mini Project'],
    },
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      category: 'Programming',
      level: 'Beginner',
      instructor: 'Sameer Khan',
      minutes: 200,
      description: 'Core JS: variables, DOM, events, and building interactive pages.',
      url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
      lessons: ['JS Basics', 'DOM Manipulation', 'Events', 'Fetch API'],
    },
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      category: 'Competitive Exams',
      level: 'Intermediate',
      instructor: 'Prof. Arjun Mehta',
      minutes: 480,
      description: 'Arrays, linked lists, trees, graphs, sorting, and searching for interviews & exams.',
      url: 'https://www.youtube.com/embed/RBSGKlAvoiM',
      lessons: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching'],
    },
    {
      id: 'ml',
      title: 'Machine Learning Foundations',
      category: 'AI & ML',
      level: 'Intermediate',
      instructor: 'Dr. Nisha Verma',
      minutes: 360,
      description: 'Regression, classification, model evaluation, and a first ML project in Python.',
      url: 'https://www.youtube.com/embed/ukzFI9rgwfU',
      lessons: ['What is ML?', 'Regression', 'Classification', 'Model Evaluation'],
    },
    {
      id: 'datascience',
      title: 'Data Science with Python',
      category: 'Data Science',
      level: 'Intermediate',
      instructor: 'Karan Joshi',
      minutes: 300,
      description: 'Pandas, NumPy, visualization, and a full exploratory data analysis workflow.',
      url: 'https://www.youtube.com/embed/r-uOLxNrNk8',
      lessons: ['NumPy', 'Pandas', 'Matplotlib', 'EDA Project'],
    },
    {
      id: 'calculus',
      title: 'Calculus I — Limits & Derivatives',
      category: 'School Education',
      level: 'Beginner',
      instructor: 'Prof. Arjun Mehta',
      minutes: 260,
      description: 'Limits, continuity, derivatives, and real-world applications.',
      url: 'https://www.youtube.com/embed/WUvTyaaNkzM',
      lessons: ['Limits', 'Continuity', 'Derivatives', 'Applications'],
    },
    {
      id: 'english',
      title: 'English Grammar Mastery',
      category: 'Languages',
      level: 'Beginner',
      instructor: 'Sara Ali',
      minutes: 180,
      description: 'Tenses, sentence structure, articles, and common grammar pitfalls.',
      url: 'https://www.youtube.com/embed/1cQ5YjFxjyQ',
      lessons: ['Tenses', 'Sentence Structure', 'Articles', 'Common Mistakes'],
    },
    {
      id: 'uiux',
      title: 'UI/UX Design Fundamentals',
      category: 'Design',
      level: 'Beginner',
      instructor: 'Riya Kapoor',
      minutes: 220,
      description: 'Design thinking, wireframing, prototyping, and usability principles.',
      url: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
      lessons: ['Design Thinking', 'Wireframes', 'Prototyping', 'Usability'],
    },
    {
      id: 'business',
      title: 'Business Analytics Basics',
      category: 'Business',
      level: 'Beginner',
      instructor: 'Anil Sharma',
      minutes: 190,
      description: 'KPIs, dashboards, and decision-making with data.',
      url: 'https://www.youtube.com/embed/8gCPuXKd4yY',
      lessons: ['KPIs', 'Dashboards', 'Decision Making'],
    },
    {
      id: 'dsa-adv',
      title: 'Advanced Algorithms',
      category: 'Competitive Exams',
      level: 'Advanced',
      instructor: 'Prof. Arjun Mehta',
      minutes: 520,
      description: 'Dynamic programming, greedy algorithms, and graph theory.',
      url: 'https://www.youtube.com/embed/oBt53YbR9Kk',
      lessons: ['Dynamic Programming', 'Greedy', 'Graph Theory', 'Advanced Problems'],
    },
  ];

  /* ---------------------------------------------------------
     2. STATE
     --------------------------------------------------------- */
  const state = {
    query: '',
    category: 'All',
    level: 'All',
    currentCourse: courses[0],
    bookmarks: new Set(),
  };

  /* ---------------------------------------------------------
     3. DOM REFERENCES
     --------------------------------------------------------- */
  const pages         = document.querySelectorAll('.page');
  const navLinks      = document.querySelectorAll('.nav-link');
  const homeCourses   = document.querySelector('#homeCourses');
  const courseGrid    = document.querySelector('#courseGrid');
  const continueList  = document.querySelector('#continueList');
  const resultCount   = document.querySelector('#resultCount');

  const searchForm    = document.querySelector('#searchForm');
  const searchInput   = document.querySelector('#searchInput');
  const categoryFilter = document.querySelector('#categoryFilter');
  const levelFilter   = document.querySelector('#levelFilter');
  const themeToggle   = document.querySelector('#themeToggle');

  const quizForm      = document.querySelector('#quizForm');
  const quizResult    = document.querySelector('#quizResult');

  const assistantForm = document.querySelector('#assistantForm');
  const assistantInput = document.querySelector('#assistantInput');
  const assistantMessages = document.querySelector('#assistantMessages');

  const watchVideo       = document.querySelector('#watchVideo');
  const watchTitle       = document.querySelector('#watchTitle');
  const watchCategory    = document.querySelector('#watchCategory');
  const watchDescription = document.querySelector('#watchDescription');
  const curriculumList   = document.querySelector('#curriculumList');
  const bookmarkBtn      = document.querySelector('#bookmarkBtn');

  /* ---------------------------------------------------------
     4. HELPERS
     --------------------------------------------------------- */
  function courseInitial(course) {
    return course.category
      .split(' ')
      .map(word => word[0])
      .join('')
      .replace('&', 'A')
      .toUpperCase();
  }

  function renderCourseCard(course) {
    return `
      <article class="course-card">
        <a href="#watch" data-watch="${course.id}">
          <div class="thumb">${courseInitial(course)}</div>
          <div class="course-body">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <span>${course.category} • ${course.level} • ${course.minutes} min</span>
            <div class="course-actions">
              <strong>${course.instructor}</strong>
              <button class="small-button" type="button" data-watch="${course.id}">Watch</button>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function filteredCourses() {
    const q = state.query.toLowerCase();
    return courses.filter(course => {
      const haystack =
        `${course.title} ${course.category} ${course.level} ${course.instructor} ${course.description}`.toLowerCase();
      const matchesQuery    = q === '' || haystack.includes(q);
      const matchesCategory = state.category === 'All' || course.category === state.category;
      const matchesLevel    = state.level === 'All' || course.level === state.level;
      return matchesQuery && matchesCategory && matchesLevel;
    });
  }

  function renderCourses() {
    const list = filteredCourses();

    // Home: top 8
    homeCourses.innerHTML = list.slice(0, 8).map(renderCourseCard).join('')
      || '<p style="color:var(--muted);">No courses match your filters.</p>';

    // Courses page: all
    courseGrid.innerHTML = list.map(renderCourseCard).join('')
      || '<p style="color:var(--muted);">No courses match your filters.</p>';

    // Count
    resultCount.textContent = `${list.length} study video${list.length === 1 ? '' : 's'}`;

    // Continue list (random progress for demo)
    continueList.innerHTML = courses.slice(0, 4).map(course => `
      <article>
        <strong>${course.title}</strong>
        <span>${course.category} • Resume lesson ${Math.floor(Math.random() * 4) + 1}</span>
        <progress value="${45 + Math.floor(Math.random() * 45)}" max="100"></progress>
      </article>
    `).join('');
  }

  /* ---------------------------------------------------------
     5. PAGE NAVIGATION
     --------------------------------------------------------- */
  function showPage(hash) {
    const pageId = (hash || '#home').replace('#', '') || 'home';
    const target = document.querySelector(`#${pageId}`);

    if (!target) {
      location.hash = '#home';
      return;
    }

    pages.forEach(page => page.classList.toggle('active-page', page.id === pageId));
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------------------------------------------------
     6. WATCH PAGE
     --------------------------------------------------------- */
  function openCourse(courseId) {
    const course = courses.find(item => item.id === courseId);
    if (!course) return;

    state.currentCourse = course;

    watchVideo.src         = course.url;
    watchCategory.textContent = `${course.category} • ${course.level}`;
    watchTitle.textContent    = course.title;
    watchDescription.textContent = course.description;
    curriculumList.innerHTML  = course.lessons
      .map((lesson, i) => `<li>${i + 1}. ${lesson}</li>`)
      .join('');

    bookmarkBtn.textContent = state.bookmarks.has(course.id) ? '★ Bookmarked' : '☆ Bookmark';
  }

  /* ---------------------------------------------------------
     7. GLOBAL CLICK HANDLER (cards, topics, bookmarks)
     --------------------------------------------------------- */
  document.addEventListener('click', event => {
    // Watch buttons / card links
    const watchTarget = event.target.closest('[data-watch]');
    if (watchTarget) {
      event.preventDefault();
      openCourse(watchTarget.dataset.watch);
      location.hash = '#watch';
      return;
    }

    // Topic filter buttons
    const topic = event.target.closest('[data-filter]');
    if (topic) {
      state.category = topic.dataset.filter;
      if (categoryFilter) categoryFilter.value = state.category;
      renderCourses();
      location.hash = '#courses';
    }
  });

  /* ---------------------------------------------------------
     8. SEARCH
     --------------------------------------------------------- */
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    state.query = searchInput.value.trim();
    renderCourses();
    location.hash = '#courses';
  });

  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchForm.requestSubmit();
    }
  });

  /* ---------------------------------------------------------
     9. FILTERS
     --------------------------------------------------------- */
  categoryFilter.addEventListener('change', event => {
    state.category = event.target.value;
    renderCourses();
  });

  levelFilter.addEventListener('change', event => {
    state.level = event.target.value;
    renderCourses();
  });

  /* ---------------------------------------------------------
     10. BOOKMARK
     --------------------------------------------------------- */
  bookmarkBtn.addEventListener('click', () => {
    const id = state.currentCourse.id;
    if (state.bookmarks.has(id)) {
      state.bookmarks.delete(id);
    } else {
      state.bookmarks.add(id);
    }
    openCourse(id);
  });

  /* ---------------------------------------------------------
     11. QUIZ
     --------------------------------------------------------- */
  quizForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target);
    let score = 0;
    if (data.get('q1') === 'CSS') score += 1;
    if (data.get('q2') === 'Post') score += 1;
    quizResult.textContent = `Score: ${score}/2. ${
      score === 2 ? 'Excellent revision work. 🎉' : 'Review the lesson and try again.'
    }`;
  });

  /* ---------------------------------------------------------
     12. AI ASSISTANT
     --------------------------------------------------------- */
  assistantForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = assistantInput.value.trim();
    if (!value) return;

    // Basic sanitization
    const safe = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    assistantMessages.insertAdjacentHTML(
      'beforeend',
      `<p><strong>You:</strong> ${safe}</p>`
    );

    // Simulated AI reply
    const reply =
      'Start with one concept video, write 5 notes, take a quiz, then revise with a short practice task. Based on your goal, I recommend Programming, Data Science, and AI & ML lessons from the course library.';
    assistantMessages.insertAdjacentHTML(
      'beforeend',
      `<p><strong>EduVora AI:</strong> ${reply}</p>`
    );

    assistantInput.value = '';
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  });

  /* ---------------------------------------------------------
     13. THEME TOGGLE
     --------------------------------------------------------- */
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try {
      localStorage.setItem(
        'eduvora.theme',
        document.body.classList.contains('dark') ? 'dark' : 'light'
      );
    } catch { /* ignore */ }
  });

  /* ---------------------------------------------------------
     14. HASH ROUTING
     --------------------------------------------------------- */
  window.addEventListener('hashchange', () => showPage(location.hash));

  /* ---------------------------------------------------------
     15. INITIALIZATION
     --------------------------------------------------------- */
  function init() {
    // Restore theme
    try {
      if (localStorage.getItem('eduvora.theme') === 'dark') {
        document.body.classList.add('dark');
      }
    } catch { /* ignore */ }

    // Seed a couple of bookmarks
    state.bookmarks.add('python');

    // Initial render
    renderCourses();
    openCourse('python');
    showPage(location.hash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
