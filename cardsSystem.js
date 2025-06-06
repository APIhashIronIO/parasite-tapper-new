// cardsSystem.js
const cards = [
  {
    id: 1,
    name: "Spore Injector",
    bonus: { perSecond: 650 },
    cost: 1500,
    icon: "assets/cards/card_1.png",
    bought: false,
  },
  {
    id: 2,
    name: "Contagion Protocol",
    bonus: { perMinute: 999 },
    cost: 3450,
    icon: "assets/cards/card_2.png",
    bought: false,
  },
  {
    id: 3,
    name: "Genome Splitter",
    bonus: { perSecond: 1000 },
    cost: 4500,
    icon: "assets/cards/card_3.png",
    bought: false,
  },
  {
    id: 4,
    name: "Toxic Bloom",
    bonus: { perMinute: 23000 },
    cost: 25000,
    icon: "assets/cards/card_4.png",
    bought: false,
  },
  {
    id: 5,
    name: "NanoHive",
    bonus: { perSecond: 45000 },
    cost: 100000,
    icon: "assets/cards/card_5.png",
    bought: false,
  },
  {
    id: 6,
    name: "NeuroPlague",
    bonus: { perMinute: 70000 },
    cost: 170000,
    icon: "assets/cards/card_6.png",
    bought: false,
  },
  {
    id: 7,
    name: "Heat Mutation",
    bonus: { perSecond: 100000 },
    cost: 250000,
    icon: "assets/cards/card_7.png",
    bought: false,
  },
  {
    id: 8,
    name: "MetaReplicator",
    bonus: { perMinute: 200000 },
    cost: 500000,
    icon: "assets/cards/card_8.png",
    bought: false,
  },
  {
    id: 9,
    name: "Plague Ascension",
    bonus: { perSecond: 400000 },
    cost: 850000,
    icon: "assets/cards/card_9.png",
    bought: false,
  },
];

export default cards;
export function applyCardBonuses(gameState) {
  cards.forEach(card => {
    if (card.bought) {
      if (card.bonus.perSecond) {
        gameState.bonusPerSecond += card.bonus.perSecond;
      }
      if (card.bonus.perMinute) {
        gameState.bonusPerMinute += card.bonus.perMinute;
      }
    }
  });
}
