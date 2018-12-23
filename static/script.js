'use strict';
console.log(document);

const container = document.getElementById('container');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const slot4 = document.getElementById('slot4');
const stack = document.getElementById('stack');

let imageSize = {
	width: 110,
	heigth: 158
}

let topDown = Math.floor(innerHeight / 23);

let x = window.matchMedia('(max-width: 600px)');
if (x.matches) {
	imageSize.width = innerWidth / 4.5;
	imageSize.height = innerWidth / 3.2;

	document.addEventListener('touchmove', (event) => {
		if (event.scale !== 1) {
			event.preventDefault();
		}
	}, false);

	window.addEventListener('resize', () => {
		container.style.top = '2vh';
		stack.style.left = Math.round(innerWidth / 2 - imageSize.width / 2) + 'px';
	});
};

container.style.top = '1vh';
stack.style.left = Math.round(innerWidth / 2 - imageSize.width / 2) + 'px';

window.addEventListener('resize', () => {
	container.style.top = '2vh';
	stack.style.left = Math.round(innerWidth / 2 - imageSize.width / 2) + 'px';
});

function Deck() {
	this.initDeck = function() {

	let spades = this.initCards('spades');
	let clubs = this.initCards('clubs');
	let diamonds = this.initCards('diamonds');
	let hearts = this.initCards('hearts');

	this.cards = spades.concat(clubs, diamonds, hearts);
	};

	this.initCards = function(color) {

		function Card(name, value, color) {
			this.name = name;
			this.value = value;
			this.color = color;
			this.image = new Image(imageSize.width, imageSize.height);
			this.image.src = '/static/svgCards/' + name + '.svg';
			this.image.name = name;
			this.image.slot = null;
			this.isDeletable = false;
		}

		let cards = [];

		for (let i = 2; i < 15; i++) {
			if (i < 11) {
				let name = i + ' of ' + color;
				let value = i;
				let card = new Card(name, value, color);
				cards.push(card);
			} else if (i == 11) {
				let name = 'Jack of ' + color;
				let value = i;
				let card = new Card(name, value, color);
				cards.push(card);
			} else if (i == 12) {
				let name = 'Queen of ' + color;
				let value = i;
				let card = new Card(name, value, color);
				cards.push(card);
			} else if (i == 13) {
				let name = 'King of ' + color;
				let value = i;
				let card = new Card(name, value, color);
				cards.push(card);
			} else {
				let name = 'Ace of ' + color;
				let value = i;
				let card = new Card(name, value, color);
				cards.push(card);
			};
		};
		return cards;
	};

	this.shuffle = function(cards) {
		let crntIndx = cards.length, tempVal, rndmIndx;

		while (0 !== crntIndx) {
			rndmIndx = Math.floor(Math.random() * crntIndx);
			crntIndx -= 1;

			tempVal = cards[crntIndx];
			cards[crntIndx] = cards[rndmIndx];
			cards[rndmIndx] = tempVal;
		};

		return cards;
	};
}

let deck = new Deck;
let current4 = [];
let onTable = [];
let noDeletes = [];
let aces = [];
let slots = document.getElementsByClassName('slot');
let cardBack = new Image(imageSize.width, imageSize.height);
cardBack.src = '/static/svgCards/Card back.svg';

window.onload = function() {
deck.initDeck();
stack.appendChild(cardBack);
deck.shuffle(deck.cards);

window.addEventListener('click', deal);
};

function deal(e) {
	if (e.target != cardBack) return;
	if (current4.length != 4 && (slot1.childNodes.length > 1 || slot2.childNodes.length > 1 || slot3.childNodes.length > 1 || slot4.childNodes.length > 1)) return;

	current4 = [];

	for (let i = 0; i < slots.length; i++) {
		if (slots[i].hasAttribute('isEmpty')) {
			slots[i].removeAttribute('isEmpty');
			slots[i].classList.remove('empty');
		};
	};

	let card1 = drawCard(deck.cards)
	current4.push(card1);
	onTable.push(card1);
	card1.image.slot = 'slot1';
	card1.image.classList.add('image');
	card1.image.style.top = topDown * slot1.childNodes.length + 'px';
	slot1.appendChild(card1.image);

	let card2 = drawCard(deck.cards)
	current4.push(card2);
	onTable.push(card2);
	card2.image.slot = 'slot2';
	card2.image.classList.add('image');
	card2.image.style.top = topDown * slot2.childNodes.length + 'px';
	slot2.appendChild(card2.image);

	let card3 = drawCard(deck.cards)
	current4.push(card3);
	onTable.push(card3);
	card3.image.slot = 'slot3';
	card3.image.classList.add('image');
	card3.image.style.top = topDown * slot3.childNodes.length + 'px';
	slot3.appendChild(card3.image);

	let card4 = drawCard(deck.cards)
	current4.push(card4);
	onTable.push(card4);
	card4.image.slot = 'slot4';
	card4.image.classList.add('image');
	card4.image.style.top = topDown * slot4.childNodes.length + 'px';
	slot4.appendChild(card4.image);

	if (deck.cards.length == 0) {
		checkDeletable(current4);
		current4.sort(compare);
		container.addEventListener('click', deleteCard);
		stack.removeChild(cardBack);
		checkEnd();
	};
	current4.sort(compare);
	inBetween();
}

function drawCard(array) {
	let card = array.shift();
	return card;
}

function inBetween() {
	let moveReadies = [];
	defineCurrent4();
	checkIfEmpty();
	checkDeletable(current4);

	if (current4.length == 4) {
		container.removeEventListener('click', moveCard);
	} else {
		container.addEventListener('click', moveCard);
	};

	for (let i = 0; i < slots.length; i++) {
		if (slots[i].classList.contains('slot empty moveReady')) {
			moveReadies.push(slots[i]);
		};
	}

	if (moveReadies.length > 0) {
		container.removeEventListener('click', deleteCard);
	} else {
		container.addEventListener('click', deleteCard);
	};

	if (deck.cards.length == 0) {
					checkEnd();
	};
}

function checkDeletable(arr) {
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr.length; j++) {
			if (arr[i].color == arr[j].color && arr[i].value < arr[j].value) {
				arr[i].isDeletable = true;
			};
		};
	};
}

function deleteCard(e) {
	if (e.target.parentNode.className != 'slot') return;
		e.stopPropagation();
		let i = (e.target.parentNode.id.slice(-1)) - 1;
		if (slot1.isEmpty == true) {
			i = i - 1;
		};

	for (let i = 0; i < current4.length; i++) {
		if (current4[i].isDeletable) {
			if (e.target.name == current4[i].name) {
				e.target.parentNode.removeChild(e.target);
				delete current4[i];
				inBetween();

				for (let i = 0; i < slots.length; i++) {
					if (slots[i].hasAttribute('isEmpty')) {
						if (slot1.childNodes.length > 1 || slot2.childNodes.length > 1 ||
							slot3.childNodes.length > 1 || slot4.childNodes.length > 1) {
						}
					};
				};
			};
		};

	};
	checkIfEmpty()
}

function defineCurrent4() {
	let slot1 = document.getElementById('slot1');
	let slot2 = document.getElementById('slot2');
	let slot3 = document.getElementById('slot3');
	let slot4 = document.getElementById('slot4');

	current4 = [];
	let name1, name2, name3, name4;

	if (slot1.hasChildNodes()) {
		name1 = (slot1.lastElementChild.name);
	};
	if (slot2.hasChildNodes()) {
		name2 = (slot2.lastElementChild.name);
	};
	if (slot3.hasChildNodes()) {
		name3 = (slot3.lastElementChild.name);
	};
	if (slot4.hasChildNodes()) {
		name4 = (slot4.lastElementChild.name);
	};

	for (let card of onTable) {
		if (card == null) continue;
		if (card.name == name1 || card.name == name2 || card.name == name3 || card.name == name4) {
			current4.push(card);
		};
		current4.sort(compare);
	};
	checkDeletable(current4);
}

function checkIfEmpty() {
	let slot1 = document.getElementById('slot1');
	let slot2 = document.getElementById('slot2');
	let slot3 = document.getElementById('slot3');
	let slot4 = document.getElementById('slot4');

	if (!slot1.hasChildNodes()) {
		slot1.setAttribute('isEmpty', true);
		slot1.classList.add('empty');
	};

	if (!slot2.hasChildNodes()) {
		slot2.setAttribute('isEmpty', true);
		slot2.classList.add('empty');
	};

	if (!slot3.hasChildNodes()) {
		slot3.setAttribute('isEmpty', true);
		slot3.classList.add('empty');
	};

	if (!slot4.hasChildNodes()) {
		slot4.setAttribute('isEmpty', true);
		slot4.classList.add('empty');
	};

	if (!slot1.hasAttribute('isEmpty') && !slot2.hasAttribute('isEmpty') &&
		!slot3.hasAttribute('isEmpty') && !slot4.hasAttribute('isEmpty')) {
	};
}

function moveCard(e) {
	if (e.target.className != 'slot empty') return;

	for (let i = 0; i < current4.length; i++) {
		current4[i].image.setAttribute('movable', 'yes');
	};

	e.target.classList.add('moveReady');
	chooseCard(e.target);
}

function chooseCard(slot) {
	container.removeEventListener('click', deleteCard);
	let card;
	container.addEventListener('click', move);

	function move(e) {
		for (let i = 0; i < current4.length; i++) {
			if (current4[i].name == e.target.name) {
				current4[i].image.slot = slot.id;
				current4[i].image.style.top = '0px';
				slot.classList.remove('moveReady');
				slot.classList.remove('empty');
				slot.removeAttribute('isEmpty');
				slot.appendChild(current4[i].image);
				container.removeEventListener('click', move);
			};
		};

		defineCurrent4();
		checkDeletable(current4);
			if (deck.cards.length == 0) {
				checkEnd();
			};

		inBetween();
	}
}

function checkEnd() {
	noDeletes = [];

	for (let i = 0; i < current4.length; i++) {
		if (current4[i].isDeletable == false) {
			noDeletes.push(current4[i]);
		};
	};

	if (noDeletes.length == 4) {
		endGame();
	} else {
		container.addEventListener('click', deleteCard);
	};
}

function compare(a, b) {
	if (a.image.parentNode.id < b.image.parentNode.id) return -1;
	if (a.image.parentNode.id > b.image.parentNode.id) return 1;
	return 0;
}

function endGame() {
	aces = [];

	for (let i = 0; i < current4.length; i++) {
		if (current4[i].value == 14 && current4[i].image.parentNode.childNodes.length == 1) {
			aces.push(current4[i]);
		};
	};

	if (aces.length < 4) {
		stack.style.height = '44px';
		stack.style.width = '100px';
		stack.style.left = innerWidth / 2 - stack.clientWidth / 2 + 'px';
		stack.style.bottom = '20px';
		stack.innerHTML = 'GAME OVER';
		container.removeEventListener('click', deleteCard);

		stack.addEventListener('click', function() {
			location.reload();
		});
	} else {
		stack.style.height = '44px';
		stack.style.width = '100px';
		stack.style.left = innerWidth / 2 - stack.clientWidth / 2 + 'px';
		stack.style.bottom = '20px';
		stack.innerHTML = 'YOU WIN';
		container.removeEventListener('click', deleteCard);

		stack.addEventListener('click', function() {
			location.reload();
		});
	};
}
