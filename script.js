// ---------- Config ----------
const STORAGE_KEY = "markdownSlides";

const DEFAULT_MARKDOWN = `# This is Slide 01
## This is Heading 02 in slide 01

This is your content on slide 01
---
# This is Slide 02
## This is Heading 02 in slide 02

This is your content on slide 02
---
# Slide 03
- Bullet one
- Bullet two
`;

// ---------- Elements ----------
const editor = document.getElementById("editor");
const slideEl = document.getElementById("slide");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");

// ---------- State ----------
let slides = [];
let currentIndex = 0; 

// ---------- Core functions ----------

function splitSlides(text) {
  const parts = text
    .split(/^\s*---\s*$/m)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

 
  return parts.length > 0 ? parts : [""];
}


function renderSlide() {
  // Keep the index valid if slides were deleted while typing
  if (currentIndex > slides.length - 1) currentIndex = slides.length - 1;
  if (currentIndex < 0) currentIndex = 0;

  slideEl.innerHTML = marked.parse(slides[currentIndex]);
}


function update() {
  slides = splitSlides(editor.value);
  renderSlide();
}

// ---------- Saving and loading ----------
function saveSlides() {
  localStorage.setItem(STORAGE_KEY, editor.value);
  showStatus("Saved!");
}

function loadSlides() {
  const saved = localStorage.getItem(STORAGE_KEY);
  editor.value = saved !== null ? saved : DEFAULT_MARKDOWN;
}

let statusTimer;
function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.add("visible");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => statusEl.classList.remove("visible"), 1500);
}

// ---------- Events ----------
editor.addEventListener("input", update);

saveBtn.addEventListener("click", saveSlides);

document.addEventListener("keydown", (event) => {
  // Ctrl+S (or Cmd+S on Mac): save instead of opening the browser's save dialog
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveSlides();
  }
});

// ---------- Start ----------
loadSlides();
update();