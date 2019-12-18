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

		let addIns = [
		{suit: "D", value: "k"},
		{suit: "H", value: "k"},
		{suit: "C", value: "k"},
		{suit: "S", value: "k"},
		{suit: "D", value: "a"},
		{suit: "H", value: "a"},
		{suit: "C", value: "a"},
		{suit: "S", value: "a"},
		]

				// {suit: "D", value: "Z"},
		// {suit: "C", value: "Z"}

		shuffled = shuffle(shuffled.concat(addIns))

		return {cards: cards, deck: shuffled, discard: []}
	}
}