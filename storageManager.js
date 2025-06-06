export function saveCardsState(cards) {
  localStorage.setItem("cardsData", JSON.stringify(cards));
}

export function loadCardsState() {
  const saved = localStorage.getItem("cardsData");
  return saved ? JSON.parse(saved) : null;
}
