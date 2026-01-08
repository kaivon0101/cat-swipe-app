const TOTAL_CATS = 10;

/* Elements */
const container = document.getElementById("card-container");
const favoritesSection = document.getElementById("favorites");
const summary = document.getElementById("summary");

const likeCountEl = document.getElementById("like-count");
const favCountEl = document.getElementById("fav-count");
const favTotalEl = document.getElementById("fav-total");
const favGrid = document.getElementById("fav-grid");

const chooseTab = document.getElementById("chooseTab");
const favTab = document.getElementById("favTab");
const refreshBtn = document.getElementById("refreshBtn");

/* State */
let favorites = [];

/* -------------------- Tabs -------------------- */
chooseTab.onclick = () => {
  container.classList.remove("hidden");
  favoritesSection.classList.add("hidden");
};

favTab.onclick = () => {
  container.classList.add("hidden");
  favoritesSection.classList.remove("hidden");
};

/* -------------------- Load Cats -------------------- */
const cats = Array.from({ length: TOTAL_CATS }, (_, i) =>
  `https://cataas.com/cat?width=400&height=500&random=${Date.now() + i}`
);

cats.reverse().forEach(createCard);

/* -------------------- Create Card -------------------- */
function createCard(url) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundImage = `url(${url})`;

  // Append card and enable swipe
  container.appendChild(card);
  addSwipe(card, url);
}

/* -------------------- Swipe -------------------- */
function addSwipe(card, url) {
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    dragging = true;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!dragging) return;
    currentX = e.clientX - startX;
    card.style.transform =
      `translateX(${currentX}px) rotate(${currentX / 15}deg)`;
  });

  card.addEventListener("pointerup", () => {
    dragging = false;

    if (currentX > 120) {
      swipeOut(card, 1, true, url);  // swipe right → favorite
    } else if (currentX < -120) {
      swipeOut(card, -1, false, url); // swipe left → skip
    } else {
      card.style.transform = "";
    }
  });
}

/* -------------------- Swipe Out -------------------- */
function swipeOut(card, direction, liked, url) {
  card.style.transform =
    `translateX(${direction * 1000}px) rotate(${direction * 30}deg)`;

  setTimeout(() => {
    card.remove();

    if (liked) addFavorite(url);

    if (container.children.length === 0) {
      showSummary();
    }
  }, 300);
}

/* -------------------- Favorites Logic -------------------- */
function addFavorite(url) {
  if (!favorites.includes(url)) {
    favorites.push(url);
    updateFavorites();
  }
}

function updateFavorites() {
  favGrid.innerHTML = "";

  favorites.forEach((url, index) => {
    const containerDiv = document.createElement("div");
    containerDiv.className = "fav-item";

    const img = document.createElement("img");
    img.src = url;
    img.title = "Click to remove from favorites";
    img.onclick = () => {
      favorites.splice(index, 1);
      updateFavorites();
    };

    const star = document.createElement("div");
    star.className = "fav-star";
    star.textContent = "⭐";

    containerDiv.appendChild(img);
    containerDiv.appendChild(star);
    favGrid.appendChild(containerDiv);
  });

  favCountEl.textContent = favorites.length;
  favTotalEl.textContent = favorites.length;
}

/* -------------------- Refresh Choose -------------------- */
refreshBtn.onclick = () => {
  refreshChoose();
};

function refreshChoose() {
  // Clear current cards
  container.innerHTML = "";

  // Hide summary if visible 
  summary.classList.add("hidden");

  // Re-generate the cat URLs
  const newCats = Array.from({ length: TOTAL_CATS }, (_, i) =>
    `https://cataas.com/cat?width=400&height=500&random=${Date.now() + i}`
  );

  // Add cards again
  newCats.reverse().forEach(createCard);

  // Show Choose tab
  container.classList.remove("hidden");
  favoritesSection.classList.add("hidden");
}

/* -------------------- Summary -------------------- */
function showSummary() {
  container.classList.add("hidden");
  favoritesSection.classList.remove("hidden");
  summary.classList.remove("hidden");
  likeCountEl.textContent = favorites.length;
}
