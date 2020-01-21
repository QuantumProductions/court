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
		let vsums = [0,0,0]
		let hsums = [0,0,0]

		for (let rn = 0; rn < 3; rn++) {
			for (let cn = 0; cn < 3; cn++) {
				let c = cards[rn][cn]
				if ((c && c.suit === "S") || (rn === row && col === cn)) {
					vsums[rn]++
					hsums[cn]++
					if (vsums[rn] >=2 || hsums[cn] >= 2) {
						return true
					}
				}
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

		cards[col][row] = card
		return cards
	}

	static gameStart() {
		let shuffled = shuffle(this.startingCards())
		let cards = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		]
		console.log("game start")
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

				// {suit: "D", value: "Z"},
		// {suit: "C", value: "Z"}

		shuffled = shuffle(shuffled.concat(addIns))
		console.log("Here's my discard" + JSON.stringify(this.discard))
		return {cards: cards, deck: shuffled, discard: this.discard}
	}
}