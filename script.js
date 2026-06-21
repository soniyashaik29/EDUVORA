];

const state = {
  query: "",
  category: "All",
  level: "All",
  currentCourse: courses[0],
  bookmarks: new Set()
};

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
const homeCourses = document.querySelector("#homeCourses");
const courseGrid = document.querySelector("#courseGrid");
const continueList = document.querySelector("#continueList");
const resultCount = document.querySelector("#resultCount");

function courseInitial(course) {
  return course.category.split(" ").map(word => word[0]).join("").replace("&", "A");
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
  return courses.filter(course => {
    const haystack = `${course.title} ${course.category} ${course.level} ${course.instructor} ${course.description}`.toLowerCase();
    const matchesQuery = haystack.includes(state.query.toLowerCase());
    const matchesCategory = state.category === "All" || course.category === state.category;
    const matchesLevel = state.level === "All" || course.level === state.level;
    return matchesQuery && matchesCategory && matchesLevel;
  });
}

function renderCourses() {
  const list = filteredCourses();
  homeCourses.innerHTML = list.slice(0, 8).map(renderCourseCard).join("");
  courseGrid.innerHTML = list.map(renderCourseCard).join("");
  resultCount.textContent = `${list.length} study video${list.length === 1 ? "" : "s"}`;
  continueList.innerHTML = courses.slice(0, 4).map(course => `
    <article>
      <strong>${course.title}</strong>
      <span>${course.category} • Resume lesson ${Math.floor(Math.random() * 4) + 1}</span>
      <progress value="${45 + Math.floor(Math.random() * 45)}" max="100"></progress>
    </article>
  `).join("");
}

function showPage(hash) {
  const pageId = (hash || "#home").replace("#", "");
  pages.forEach(page => page.classList.toggle("active-page", page.id === pageId));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.page === pageId));
  if (!document.querySelector(`#${pageId}`)) {
    location.hash = "#home";
  }
}

function openCourse(courseId) {
  const course = courses.find(item => item.id === courseId);
  if (!course) return;
  state.currentCourse = course;
  document.querySelector("#watchVideo").src = course.url;
  document.querySelector("#watchCategory").textContent = `${course.category} • ${course.level}`;
  document.querySelector("#watchTitle").textContent = course.title;
  document.querySelector("#watchDescription").textContent = course.description;
  document.querySelector("#curriculumList").innerHTML = course.lessons.map(lesson => `<li>${lesson}</li>`).join("");
  document.querySelector("#bookmarkBtn").textContent = state.bookmarks.has(course.id) ? "Bookmarked" : "Bookmark";
}

document.addEventListener("click", event => {
  const watchTarget = event.target.closest("[data-watch]");
  if (watchTarget) {
    openCourse(watchTarget.dataset.watch);
    location.hash = "#watch";
  }

  const topic = event.target.closest("[data-filter]");
  if (topic) {
    state.category = topic.dataset.filter;
    document.querySelector("#categoryFilter").value = state.category;
    renderCourses();
    location.hash = "#courses";
  }
});

document.querySelector("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  state.query = document.querySelector("#searchInput").value.trim();
  renderCourses();
  location.hash = "#courses";
});

document.querySelector("#searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector("#searchForm").requestSubmit();
  }
});

document.querySelector("#categoryFilter").addEventListener("change", event => {
  state.category = event.target.value;
  renderCourses();
});

document.querySelector("#levelFilter").addEventListener("change", event => {
  state.level = event.target.value;
  renderCourses();
});

document.querySelector("#bookmarkBtn").addEventListener("click", () => {
  const id = state.currentCourse.id;
  if (state.bookmarks.has(id)) {
    state.bookmarks.delete(id);
  } else {
    state.bookmarks.add(id);
  }
  openCourse(id);
});

document.querySelector("#quizForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.target);
  let score = 0;
  if (data.get("q1") === "CSS") score += 1;
  if (data.get("q2") === "Connect") score += 1;
  document.querySelector("#quizResult").textContent = `Score: ${score}/2. ${score === 2 ? "Excellent revision work." : "Review the lesson and try again."}`;
});

document.querySelector("#assistantForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#assistantInput");
  const value = input.value.trim();
  if (!value) return;
  const box = document.querySelector("#assistantMessages");
  box.insertAdjacentHTML("beforeend", `<p><strong>You:</strong> ${value}</p>`);
  box.insertAdjacentHTML("beforeend", `<p><strong>EduVora AI:</strong> Start with one concept video, write 5 notes, take a quiz, then revise with a short practice task. Based on your goal, I recommend Programming, Data Science, and AI & ML lessons from the course library.</p>`);
  input.value = "";
  box.scrollTop = box.scrollHeight;
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

window.addEventListener("hashchange", () => showPage(location.hash));

renderCourses();
openCourse("python");
showPage(location.hash);