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
    'dojo/text!/public/js/app/templates/LaoLetterChallenge.html'
],
function(Chronometer, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, array, declare, lang, dom, domAttr, domClass, domConstruct, domStyle, JSON, keys, on, tmpl) {

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
        lang: "fr",
        currentIllustration: '',

        /** @constructor */
        constructor: function (alphabet, title) {
            console.log('app/LaoLetterChallenge@constructor');
            this.alphabet = alphabet;
            this.title = title;
        },

        /**
         * @method startup
         * @description final step of dojo lifecycle - dom is loaded
         */
        startup: function () {
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
                on(this.soundInterruptorNode, 'click', lang.hitch(this, function () {
                    this.switchSoundInterruptorState();
                })),
                on(this.btnCurrentNoticeNode, 'mouseover', lang.hitch(this, function () {
                    domClass.remove(this.currentNoticeTableNode, 'hidden');
                })),
                on(this.btnCurrentNoticeNode, 'mouseout', lang.hitch(this, function () {
                    domClass.add(this.currentNoticeTableNode, 'hidden');
                })),
                on(this.launchBtnNode, 'click', lang.hitch(this, 'onLaunchBtnClick')),
                on(this.answerInputNode, 'keypress', lang.hitch(this, 'onAnswerInputKeypress'))
            );
        },

        /**
         * @method onAnswerInputKeypress
         * @description when keypess on answerInput Node, check if win or lose
         */
        onAnswerInputKeypress: function (evt) {
            console.log('app/LaoLetterChallenge@onAnswerInputKeypress');
        },

        /**
         * @method onLaunchBtnClick
         * @description when launchButton is clicked, a new try begin
         */
        onLaunchBtnClick: function (evt) {
            console.log('app/LaoLetterChallenge@onLaunchBtnClick');
            var newRandIndex = -1;

            //if game is not begin, launch timer, reset score
            if (this.randIndex === -1) {
                this.scoreNode.textContent = '';
                this.scoreNode.textContent = 'Score: ' + this.currentScore + ' / ' + this.gameTurnNumber;
                this.chronometer.startChrono();
            }
            else {
                this.chronometer.continueChrono();
            }

            //reset dom state for a new letter try
            this.laoWordNode.textContent = '';
            domAttr.set(this.illustrationImgNode, 'src', '');
            domClass.remove(this.laoLetterNode, 'splitted-container');
            domClass.add(this.illustrationNode, 'hidden');
            domAttr.set(this.answerInputNode, 'value', '');
            domStyle.set(this.laoLetterNode, 'color', 'black');
            domAttr.remove(this.answerInputNode, 'disabled');
            this.switchButtonState(false);
            this.answerInputNode.focus();
            array.forEach(this.asnwerButtons, function (btn) {
                domClass.add(btn, 'hidden');
            })

            //ensure that the random index isn't the same 2 times
            do {
                newRandIndex = Math.floor(Math.random() * this.alphabet.length - 1) + 1;
            } while (this.randIndex === newRandIndex);

            //register and display new lao letter
            this.randIndex = newRandIndex;
            this.laoLetterNode.textContent = this.alphabet[this.randIndex].lao;
            domAttr.set(this.playerSourceNode, 'src', '/public/mp3/' + this.alphabet[this.randIndex].song);
            this.playerNode.load();
            this.currentIllustration = this.alphabet[this.randIndex].illustration || '';
            if (this.currentIllustration) {
                on(this.illustrationImgNode, 'load', lang.hitch(this, function () {
                    domClass.remove(this.illustrationImgNode, 'hidden');
                }));
                domAttr.set(this.illustrationImgNode, 'src', '/public/images/illustration/' + this.currentIllustration);
            }
            array.forEach(this.asnwerButtons, function (btn) {
                btn.textContent = 'a';
                domClass.remove(btn, 'hidden');
            })
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
            }
            else {
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
            this.alphabet.forEach(lang.hitch(this, function (letter) {
                var row = domConstruct.toDom('<tr><td>' + letter.lao + '</td><td>' + letter.rom.fr + '</td><td>' + letter.rom.en + '</td></tr>');
                domConstruct.place(row, this.currentNoticeTableNode);
            }));
        },

        /**
         * @method switchButtonState
         * @description enable/disable the given button
         * @param  {boolean} onState [description]
         */
        switchButtonState:function (onState) {
            console.log('app/switchButtonState@constructor');
            if (onState) {
                domAttr.remove(this.launchBtnNode, 'disabled');
                domStyle.set(this.launchBtnNode, 'cursor', 'pointer');
            }
            else {
                domAttr.set(this.launchBtnNode, 'disabled', 'true');
                domStyle.set(this.launchBtnNode, 'cursor', 'default');
            }
        },

        endCurrentLetterTry: function () {
            console.log('app/endCurrentLetterTry@constructor');
            this.chronometer.pauseChrono();
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

});
