$(document).ready(function () {

	var slotMachine = new SlotMachine(['coffee', 'tea', 'espresso']);
	var slot1Prizes = ['coffee-maker', 'teapot', 'espresso-machine'],
		slot2Prizes = ['coffee-filter', 'tea-strainer', 'espresso-tamper'],
		slot3Prizes = ['coffee-grounds', 'loose-leaf', 'ground-espresso-beans'];
	var slot1 = new Slot($(".slot1"), slot1Prizes, slotMachine),
		slot2 = new Slot($(".slot2"), slot2Prizes, slotMachine),
		slot3 = new Slot($(".slot3"), slot3Prizes, slotMachine);

	slotMachine.addSlot(slot1);
	slotMachine.addSlot(slot2);
	slotMachine.addSlot(slot3);

	$('.start-slot').on('click', function () {
		$(this).prop("disabled",true);
		$(".result").html("Spinning...");
		slotMachine.reset();
		slotMachine.play();
	})
});

/*
	A slot machine
*/
function SlotMachine (prizes) {
	this.prizes = prizes;
	this.slots = []; // An array of slot objects
	this.value = null; // The value after playing the slot machine
	var slotSpin;

	/*
		Plays the slot machine returns the won prize, null if you didn't win
	*/
	this.play = function () {
		slotSpin = 0;
		if (this.slots.length <= 0) { return; }
		this.value = null;
		var	results = [];
		// Spin all slots
		for (var i = 0, len = this.slots.length; i < len; i++) {
			results.push(this.slots[i].spin());
		}
		// Check if all results are same, quit if at least one is not same
		var elem = null;
		for (i = 0, len = results.length; i < len; i++) {
			if (!elem) { elem = results[i] }
			if (elem !== results[i]) {
				this.value = null;
				return;
			}
		}
		// If all results are the same then return the value
		this.value = results[0];
	}

	/*
		Keeps track of spinning slots. Changes DOM when all slots stop spinning
	*/
	this.finishSlotSpin = function () {
		slotSpin++;
		if (slotSpin === this.slots.length) {
			debugger
			if (this.value) {
				$(".result").html("Nice! You won " + this.prizes[this.value]);
			} else {
				$(".result").html("Sorry no caffeine for you :(");
			}
			$('.start-slot').prop("disabled",false);
		}
	}

	/*
		Adds a slot to the slot machine
		slot - Slot object
	*/
	this.addSlot = function (slot) {
		this.slots.push(slot);
	}

	/*
		Resets the slot machine for another round
	*/
	this.reset = function () {
		this.value = null;
		// Spin all slots
		for (var i = 0, len = this.slots.length; i < len; i++) {
			this.slots[i].reset();
		}
	}

	/*
		Clears the slot machine slots
	*/
	this.clearSlots = function () {
		this.slots = [];
	}
}

/*
	elem: DOM object
	numItems: the number of items in the slot
	slotItems: an array of prizes in the slot
*/
function Slot (elem, slotItems, slotMachine) {
	this.elem = elem;
	this.slotMachine = slotMachine;
	this.slotItems = slotItems;
	this.value;

	this.spin = function () {
		var that = this;
		this.value = getRandomInt(0, 2);
		this.elem.animate({
			'background-position-y': '5000px'
		}, 2000, 'linear', function () {
			this.innerHTML = '<div class="' + that.slotItems[that.value] + '"></div>';
			that.elem.addClass('hidden');
			that.elem.css({'background-position-y': '30px'});
			that.slotMachine.finishSlotSpin();
		});
		return this.value;
	}

	this.reset = function () {
		this.elem.removeClass('hidden');
		this.elem.empty();
	};
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

