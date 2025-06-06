// cardsSystem.js
const cards = [
  {
    id: 1,
    name: "Spore Injector",
    bonus: { perSecond: 1 },
    cost: 500,
    icon: "assets/cards/card_1.png",
    bought: false,
  },
  {
    id: 2,
    name: "Contagion Protocol",
    bonus: { perMinute: 10 },
    cost: 1000,
    icon: "assets/cards/card_2.png",
    bought: false,
  },
  {
    id: 3,
    name: "Genome Splitter",
    bonus: { perSecond: 2 },
    cost: 2500,
    icon: "assets/cards/card_3.png",
    bought: false,
  },
  {
    id: 4,
    name: "Toxic Bloom",
    bonus: { perMinute: 20 },
    cost: 5000,
    icon: "assets/cards/card_4.png",
    bought: false,
  },
  {
    id: 5,
    name: "NanoHive",
    bonus: { perSecond: 5 },
    cost: 10000,
    icon: "assets/cards/card_5.png",
    bought: false,
  },
  {
    id: 6,
    name: "NeuroPlague",
    bonus: { perMinute: 50 },
    cost: 15000,
    icon: "assets/cards/card_6.png",
    bought: false,
  },
  {
    id: 7,
    name: "Heat Mutation",
    bonus: { perSecond: 10 },
    cost: 25000,
    icon: "assets/cards/card_7.png",
    bought: false,
  },
  {
    id: 8,
    name: "MetaReplicator",
    bonus: { perMinute: 100 },
    cost: 50000,
    icon: "assets/cards/card_8.png",
    bought: false,
  },
  {
    id: 9,
    name: "Plague Ascension",
    bonus: { perSecond: 50 },
    cost: 100000,
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
