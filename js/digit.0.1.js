// JavaScript Document

$(function () {
		
	(function () {
			
		Number.prototype.mod = function(n) {
			return ((this%n)+n)%n;
		}
		
		// The Model
		var digitModel = {
			allDigits : [[0,1,0,1,0,1,1,0,1,1,0,1,0,1,0],
						[0,1,1,0,0,1,0,0,1,0,0,1,0,0,1],
						[1,1,0,0,0,1,0,1,0,1,0,0,1,1,1],
						[1,1,0,0,0,1,0,1,0,0,0,1,1,1,1],
						[1,0,0,1,0,1,1,1,1,0,0,1,0,0,1],
						[1,1,1,1,0,0,1,1,0,0,0,1,1,1,0],
						[0,1,1,1,0,0,1,1,1,1,0,1,1,1,0],
						[1,1,1,0,0,1,0,1,1,0,0,1,0,0,1],
						[0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
						[0,1,0,1,0,1,1,1,1,0,0,1,1,1,0]],
			theDigits : [],
			theNumber : [],
			theGuess : [-1,-1,-1],
			allSet : [false,false,false], // Booleans to set if three numbers are guessed
			turns : 0,
			lost : false,
			
			randomNumber : function (maxNr) { // Returns a random number from 0 to maxNr
				return Math.floor(Math.random()*(maxNr + 1));
			},
			
			newNumber : function () {
				var allNumbers = [0,1,2,3,4,5,6,7,8,9];
				for (var i = 0; i < 3; i++) {
					this.theNumber[i] = parseInt(allNumbers.splice(this.randomNumber(9-i),1).join());
					this.theDigits[i] = this.allDigits[this.theNumber[i]].slice()
				}
				console.log(this.theNumber);
				console.log(this.theDigits);
			},
			
			setReveilState : function () {
				for (var i in this.theDigits) {
					for (var j in this.theDigits[i]) {
						if (this.theDigits[i][j] < 4) {
							this.theDigits[i][j]+=4;
						}
					}
				}
			},
			
			reveilAll : function () {
				for (var i in this.theDigits) {
					for (var j in this.theDigits[i]) {
						if (this.theDigits[i][j] < 2) {
							this.theDigits[i][j]+=2;
						}
					}
				}
			},
			
			stopGame : function () {
				this.lost = true;
				this.setReveilState();
				digitInterface.setSegmentClasses(this.theDigits);
				digitInterface.togglePlayButton();
				digitInterface.toggleYourAnswer();
				digitInterface.snd.lost.play();
			},
			
			newTurn : function () {
				if (this.turns < 10) {
					this.turns++;
				} else {
					this.stopGame();
				}
			},
			
			evalTurn : function (digitNr, segNr) {
				if (this.theDigits[digitNr][segNr] < 2) {
					this.theDigits[digitNr][segNr]+=2;
				}
			},

			setGuess : function (increase, digitNr) {
				if (digitModel.theGuess[digitNr] > -1) {
					if (increase) {
						digitModel.theGuess[digitNr]+=1
					} else {
						digitModel.theGuess[digitNr]-=1
					}
					digitModel.theGuess[digitNr] = digitModel.theGuess[digitNr].mod(10)
				} else {
					digitModel.theGuess[digitNr] = 0
				}
				digitModel.allSet[digitNr] = true;
			},
						
			checkGuess : function () {
				if (this.allSet[0] && this.allSet[1] && this.allSet[2] && this.theNumber.join() === this.theGuess.join()) {
					digitInterface.snd.tada.play();
					digitModel.reveilAll();
					digitInterface.setSegmentClasses(this.theDigits);
					digitInterface.toggleYourAnswer();
					digitInterface.toggleYouwin();
					digitInterface.flash();
					digitInterface.togglePlayButton();
				}
			},
			
			init : function () {
				digitInterface.snd.shuf.play();
				digitInterface.initTouchDevice();
				this.theDigits = [];
				this.theNumber = [];
				this.theGuess = [-1,-1,-1];
				this.turns = 0;
				this.lost = false;
				this.allSet = [false,false,false]; // Booleans to set if three numbers are guessed
				this.newNumber();
				digitInterface.clearYourAnswer();
				digitInterface.resetClasses();
				digitInterface.setSegmentClasses(this.theDigits);
				digitInterface.toggleYouwin();
				digitInterface.togglePlayButton();
				digitInterface.toggleYourAnswer();
				digitInterface.resetScore();
				digitInterface.youwinOff();
				digitInterface.textOn();
			}
			
		};
		
		// The Interface
		var digitInterface = {
			
			$turnIndicator : function () {
				return $(".score div:not('.done')").first()
			},
			
			touchOrClick : 'click',
			
			initTouchDevice : function () {
				if ('ontouchstart' in document.documentElement) {
					this.touchOrClick = 'touchstart'; // This responds faster on touchdevices
					$('body').addClass('touchDevice');
				}
			},
			
			resetClasses : function () {
				$('.theNumbers a').removeClass('litCovered unlit litGreen unlitCovered litRedCovered litRed covered');
			},
			
			advanceTurns : function (turns) {
				this.$turnIndicator().addClass('done');
			},
						
			setSegmentClasses : function (theDigits) {
				for (var digit in theDigits) {
					for (var segment in theDigits[digit]) {
						theSegment = '.d'+digit+' .s'+segment;
						switch (theDigits[digit][segment]) {
							case 0 : $(theSegment).addClass('');
							break;
							case 1 : $(theSegment).addClass('litCovered');
							break;
							case 2 : $(theSegment).removeClass('covered').addClass('unlit');
							break;
							case 3 : $(theSegment).removeClass('litCovered').addClass('litGreen');
							break;
							case 4 : $(theSegment).addClass('unlitCovered');
							break;
							case 5 : $(theSegment).removeClass('litCovered').addClass('litRedCovered');
							break;
							case 6 : $(theSegment).removeClass('unlit').addClass('unlit');
							break;
							case 7 : $(theSegment).removeClass('litGreen').addClass('litRed');
							break;
						}
					}
				}
				$allSegments = $('.theNumbers a');
				$allSegments.not('.blanked, .litGreen, .unlit').addClass('covered');
			},
			
			// Set the background position of imageslider
			setGuessDigits : function (digitNr) {		
				bgPosDigits = '-' + digitModel.theGuess[digitNr] * 40 + 'px 0';
				$('.guessBox' + digitNr + ' .displayGuess').css('background-position', bgPosDigits);
				this.snd.gues.play();
				this.textOff();
			},
			
			togglePlayButton : function () {
				$('.playButton').toggle();
			},
			
			toggleYourAnswer : function () {
				$('.yourAnswer').toggle();
			},
			
			clearYourAnswer : function () {
				$('.displayGuess').css('background-position','-400px 0px');
			},
			
			toggleYouwin : function () {
				$('.youWin').toggle();
			},
			youwinOff : function () {
				$('.youWin').hide();
			},
			
			flash : function () {
				$('.youWin').hide('slow').show(0).hide('slow').show(0).hide('slow').show(0);
			},
			
			textOff : function () {
				$('#mainContent>p').hide('slow');
			},
			textOn : function () {
				$('#mainContent>p').show();
			},
						
			resetScore: function () {
				$('.score div').removeClass('done');				
			},
			
			snd : { // buffers automatically when created
				but  : new Audio("wav/supernov.wav"), 
				lost : new Audio("wav/downer.wav"),
				tada : new Audio("wav/bugle_ch.wav"),
				gues : new Audio("wav/digi_spr.wav"),
				shuf : new Audio("wav/dipping.wav")
			}

		}
		
		// Start doing this !!
		digitModel.init();
		
		// Main listener
		$('.theNumbers').on(digitInterface.touchOrClick, 'a.covered', function(){
			var digitNr = parseInt($(this).parent().parent().attr('class').substr(1,1));
			var segNr = parseInt($(this).attr('class').substr(1,2));
			if (!digitModel.lost) {
				digitInterface.snd.but.play();
				digitModel.evalTurn(digitNr, segNr);
				digitInterface.resetClasses();
				digitInterface.setSegmentClasses(digitModel.theDigits);
				digitInterface.advanceTurns(digitModel.turns);
				digitModel.newTurn();
				digitInterface.textOff();
			}
		})
		
		// Guessing listener
		$('.yourAnswer>div').on(digitInterface.touchOrClick, '.adjustButton', function () {
			var digitNr = parseInt($(this).parent().attr('class').substr(8,1));
			digitModel.setGuess($(this).hasClass('rightButton'), digitNr);
			digitInterface.setGuessDigits(digitNr);
			digitModel.checkGuess();
		})
		
		// Play button listener
		$('.playButton').on(digitInterface.touchOrClick, function(){
			digitModel.init();
		})
	
	}());
	
});

/* 
- onmogelijke getallen verduisteren als hulp 
- Introotje. 
- Geluidjes ...
*/