const suits = ["D", "H", "C", "S"]
const nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const jokers = ["Z", "Y"]

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default class Deck {
	static startingCards() {
		let cards = []
		for (let s of suits) {
			for (let n of nums) {
				if (n != "A" && n != "K") {
						cards.push({suit: s, value: n})
				}
			}
		}
		return cards
	}

	static gameStart() {
		let shuffled = shuffle(this.startingCards())
		let cards = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		]
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
					cards[i][j] = shuffled.pop()
			}
		}

		console.log("Random cards"+ cards)

		return {cards: cards, deck: shuffled, discard: []}
	}
}