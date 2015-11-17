/**
 * @file LaoLetterChallenge.js
 * @copyright NaN 2015, All Rights Reserved.
 * @author Loïc TRUCHOT
 * @license This software is the confidential and proprietary information of NaN. You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement you entered into with NaN.
 *
 */

/**
 * @module app/LaoLetterChallenge
 * @description A widget class to create and manage the Lao Letter Challenge game
 */
define([
        'app/Chronometer',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dojo/_base/array',
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/dom',
        'dojo/dom-attr',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/json',
        'dojo/keys',
        'dojo/on',
        'dojo/text!/public/js/app/templates/LaoLetterChallenge.html',
        'util/array'
    ],
    function(Chronometer, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, array, declare, lang, dom, domAttr, domClass, domConstruct, domStyle, JSON, keys, on, tmpl, utilArray) {

        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

            /**
             * @member {Array} alphabet
             * @description Contains the all collection of lao letters with metainfos
             */
            alphabet: null,
            randIndex: -1,
            currentScore: 0,
            currentTryNumber: 0,
            tryNumber: 0,
            gameTurnNumber: 10,
            isAllowedSound: true,
            templateString: tmpl,
            chosenLang: 'fr',
            currentIllustration: '',

            /** @constructor */
            constructor: function(alphabet, title) {
                console.log('app/LaoLetterChallenge@constructor');
                this.alphabet = alphabet;
                this.title = title;
            },

            /**
             * @method startup
             * @description final step of dojo lifecycle - dom is loaded
             */
            startup: function() {
                console.log('app/LaoLetterChallenge@startup');
                this.inherited(arguments);
                this.prepareNotice();
                this.asnwerButtons = [
                    this.anwserBtn1,
                    this.anwserBtn2,
                    this.anwserBtn3
                ];
                this.initializeGameHandlers();

            },

            /**
             * @method initializeGameHandlers
             * @description initiaalize all game element events like click, mouseover, etc.
             */
            initializeGameHandlers: function() {
                console.log('app/LaoLetterChallenge@initializeGameHandlers');
                this.own(
                    on(this.soundInterruptorNode, 'click', lang.hitch(this, function() {
                        this.switchSoundInterruptorState();
                    })),
                    on(this.btnCurrentNoticeNode, 'mouseover', lang.hitch(this, function() {
                        domClass.remove(this.currentNoticeTableNode, 'hidden');
                    })),
                    on(this.btnCurrentNoticeNode, 'mouseout', lang.hitch(this, function() {
                        domClass.add(this.currentNoticeTableNode, 'hidden');
                    })),
                    on(this.launchBtnNode, 'click', lang.hitch(this, 'onLaunchBtnClick')),
                    on(this.romLettersNode, '.romLetterBtn:click', lang.hitch(this, 'onRomLetterBtnClick'))
                    //on(this.answerInputNode, 'keypress', lang.hitch(this, 'onAnswerInputKeypress'))
                );
            },

            /**
             * @method onRomLetterBtnClick
             * @description when click on any romLetterBtn Node, check if win or lose
             */
            onRomLetterBtnClick: function(evt) {
                console.log('app/LaoLetterChallenge@onRomLetterBtnClick');
                var currentValue = evt.target.textContent;
                var currentLetterFr = this.alphabet[this.randIndex].rom.fr.toLowerCase();
                var currentLetterEn = this.alphabet[this.randIndex].rom.en.toLowerCase();
                if (currentValue && (currentValue.toLowerCase() === currentLetterFr || currentValue.toLowerCase() === currentLetterEn)) {
                    this.currentScore++;
                    domStyle.set(this.laoLetterNode, 'color', 'green');
                    domAttr.set(this.answerInputNode, 'value', 'Bravo: ' + currentValue);
                    this.endCurrentLetterTry();
                } else {
                    domAttr.set(this.answerInputNode, 'value', 'Perdu: ' + currentLetterFr);
                    this.endCurrentLetterTry();
                }

                //display score
                this.scoreNode.textContent = 'Score: ' + this.currentScore + ' / ' + this.gameTurnNumber;

                //end & reset game
                if (this.currentScore === this.gameTurnNumber) {
                    window.alert('Score final : ' + this.chronometer.getChronoValue());
                    this.randIndex = -1;
                    this.currentTryNumber = 0;
                    this.currentScore = 0;
                }

            },

            /**
             * @method onLaunchBtnClick
             * @description when launchButton is clicked, a new try begin
             */
            onLaunchBtnClick: function(evt) {
                console.log('app/LaoLetterChallenge@onLaunchBtnClick');

                //if game is not begin, launch timer, reset score
                if (this.randIndex === -1) {
                    this.scoreNode.textContent = '';
                    this.scoreNode.textContent = 'Score: ' + this.currentScore + ' / ' + this.gameTurnNumber;
                    this.chronometer.startChrono();
                } else {
                    this.chronometer.continueChrono();
                }

                //reset dom state for a new letter try
                this.laoWordNode.textContent = '';
                domAttr.set(this.illustrationImgNode, 'src', '');
                domClass.remove(this.laoLetterNode, 'splitted-container');
                domClass.add(this.illustrationNode, 'hidden');
                domStyle.set(this.laoLetterNode, 'color', 'black');
                domAttr.set(this.answerInputNode, 'value', '');
                domAttr.remove(this.answerInputNode, 'disabled');
                domClass.add(this.answerInputContainerNode, 'hidden');
                domClass.add(this.romLettersNode, 'hidden');
                this.switchButtonState(false);

                //ensure that the random index isn't the same 2 times
                this.randIndex = this.getRandomIndex(this.alphabet, this.randIndex);

                //register and display new lao lette
                this.laoLetterNode.textContent = this.alphabet[this.randIndex].lao;
                if (this.alphabet[this.randIndex].song) {
                    domAttr.set(this.playerSourceNode, 'src', '/public/mp3/' + this.alphabet[this.randIndex].song);
                    this.playerNode.load();
                } else {
                    domAttr.set(this.playerSourceNode, 'src', '');
                }

                //prepare illusration and loader
                this.currentIllustration = this.alphabet[this.randIndex].illustration || '';
                if (this.currentIllustration) {
                    on(this.illustrationImgNode, 'load', lang.hitch(this, function() {
                        domClass.add(this.illustrationLoaderNode, 'hidden');
                        domClass.remove(this.illustrationImgNode, 'hidden');
                    }));
                    domClass.remove(this.illustrationLoaderNode, 'hidden');
                    domClass.add(this.illustrationImgNode, 'hidden');
                    domAttr.set(this.illustrationImgNode, 'src', '/public/images/illustration/' + this.currentIllustration);
                }

                //prepare a table with the good index and 2 other random index
                var randomIndexes = [this.randIndex];
                randomIndexes.push(this.getRandomIndex(this.alphabet, randomIndexes[0]));
                randomIndexes.push(this.getRandomIndex(this.alphabet, randomIndexes[0], randomIndexes[1]));
                randomIndexes = utilArray.shuffle(randomIndexes);

                //add randomized text content or good answers to possible answers
                array.forEach(this.asnwerButtons, lang.hitch(this, function(btn, idx) {
                    btn.textContent = this.alphabet[randomIndexes[idx]].rom[this.chosenLang].toLowerCase();
                }));
                domClass.remove(this.romLettersNode, 'hidden');
                domClass.remove(this.chronometer.domNode, 'hidden');
                domClass.remove(this.scoreNode, 'hidden');
                //this.anwserBtn1.focus();
            },

            getRandomIndex: function(arr, forbiddenIndex1, forbiddenIndex2) {
                var newRandIndex = -1;
                do {
                    newRandIndex = Math.floor(Math.random() * arr.length - 1) + 1;
                } while (forbiddenIndex1 === newRandIndex || forbiddenIndex2 === newRandIndex);
                return newRandIndex;
            },

            /**
             * @method switchSoundInterruptorState
             * @description switch the sound state: true or false
             */
            switchSoundInterruptorState: function() {
                console.log('app/LaoLetterChallenge@switchSoundInterruptorState');
                if (domClass.contains(this.soundInterruptorNode, 'icon-volume-mute2')) {
                    domClass.remove(this.soundInterruptorNode, 'icon-volume-mute2');
                    domClass.add(this.soundInterruptorNode, 'icon-volume-medium');
                    this.isAllowedSound = true;
                } else {
                    domClass.remove(this.soundInterruptorNode, 'icon-volume-medium');
                    domClass.add(this.soundInterruptorNode, 'icon-volume-mute2');
                    this.isAllowedSound = false;
                }
            },

            /**
             * @method prepareNotice
             * @description to prepare a help table for users
             */
            prepareNotice: function() {
                console.log('app/LaoLetterChallenge@prepareNotice');
                this.alphabet.forEach(lang.hitch(this, function(letter) {
                    var row = domConstruct.toDom('<tr><td>' + letter.lao + '</td><td>' + letter.rom.fr + '</td><td>' + letter.rom.en + '</td></tr>');
                    domConstruct.place(row, this.currentNoticeTableNode);
                }));
            },

            /**
             * @method switchButtonState
             * @description enable/disable the given button
             * @param  {boolean} onState [description]
             */
            switchButtonState: function(onState) {
                console.log('app/switchButtonState@constructor');
                if (onState) {
                    domAttr.remove(this.launchBtnNode, 'disabled');
                    domStyle.set(this.launchBtnNode, 'cursor', 'pointer');
                } else {
                    domAttr.set(this.launchBtnNode, 'disabled', 'true');
                    domStyle.set(this.launchBtnNode, 'cursor', 'default');
                }
            },

            endCurrentLetterTry: function() {
                console.log('app/LaoLetterChallenge@endCurrentLetterTry');
                this.chronometer.pauseChrono();
                domClass.add(this.romLettersNode, 'hidden');
                domClass.remove(this.answerInputContainerNode, 'hidden');
                domAttr.set(this.answerInputNode, 'disabled', 'true');

                //play sound if authorized
                if (this.isAllowedSound) {
                    this.playerNode.play();
                }

                //display lao word and illustration linked to current letter
                var laoWord = this.alphabet[this.randIndex].laoWord;
                var romWord = this.alphabet[this.randIndex].romWord && (this.alphabet[this.randIndex].romWord[this.chosenLang]);
                if (laoWord && romWord) {
                    this.laoWordNode.textContent = laoWord + ' / ' + romWord;
                    domClass.remove(this.illustrationNode, 'hidden');
                    domClass.add(this.laoLetterNode, 'splitted-container');
                }
                this.switchButtonState(true);
                this.launchBtnNode.focus();
                this.tryNumber = 0;
                this.currentTryNumber++;
            }

        });

    }
);
