const suits = ["D", "H", "C", "S"]
export const nums = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"]

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export class Deck {
	static startingCards() {
		let cards = []
		for (let s of suits) {
			for (let n of nums) {
				if (n != "a" && n != "k") {
						cards.push({suit: s, value: n})
				}
			}
		}
		return cards
	}

	static twoSpades(cards, col, row) {
		let r1 = cards[row][0]
		let r2 = cards[row][1]
		let r3 = cards[row][2]
		for (let rc of [r1,r2,r3]) {
			if (rc && rc.suit === "S") {
				return true
			}
		}

		let c1 = cards[0][col]
		let c2 = cards[1][col]
		let c3 = cards[2][col]

		for (let cc of [c1,c2,c3]) {
			if (cc && cc.suit === "S") {
				return true
			}
		}

		return false
	}

	static applyCard(cards, col, row, shuffled) {
		let card = shuffled.pop()
		if (card.suit === "S" && this.twoSpades(cards, col, row)) {
			this.discard.push(card)
			return this.applyCard(cards, col, row, shuffled)
		}

		cards[row][col] = card
		return cards
	}

	static gameStart() {
		let shuffled = shuffle(this.startingCards())
		let cards = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		]
		this.discard = []
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
					cards = this.applyCard(cards, j, i, shuffled)
			}
		}

		let addIns = [
			{suit: "D", value: "k"},
			{suit: "H", value: "k"},
			{suit: "C", value: "k"},
			{suit: "S", value: "k"},
			{suit: "D", value: "a"},
			{suit: "H", value: "a"},
			{suit: "C", value: "a"},
			{suit: "S", value: "a"},
			{suit: "b", value: "z"},
			{suit: "r", value: "z"}
		]


		shuffled = shuffle(shuffled.concat(addIns))
		return {cards: cards, deck: shuffled, discard: this.discard}
	}
}