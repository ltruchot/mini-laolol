/**
 * @file LaoLetterChallenge.js
 * @copyright NaN 2015, All Rights Reserved.
 * @author Loïc TRUCHOT
 * @license This software is the confidential and proprietary information of NaN. You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement you entered into with NaN. 
 */

/**
 * @module app/LaoLetterChallenge
 * @description A widget class to create and manage the Lao Letter Challenge game
 */
define([
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/_base/declare",
	"dojo/_base/event",
    "dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/json",
    "dojo/keys",
	"dojo/on",           
    "dojo/text!/json/alphabet.json",
	"dojo/text!/appTemplates/LaoLetterChallenge.html"
], 
function(_WidgetBase, _TemplatedMixin, declare, dojoEvent, lang, dom, domAttr, domClass, domConstruct, domStyle, JSON, keys, on, jsonAlphabet, tmpl) {

	return declare("app/LaoLetterChallenge", [_WidgetBase,_TemplatedMixin], {

		/**
		 * @member {Array} alphabet
		 * @description Contains the all collection of lao letters with metainfos
		 */
        alphabet: JSON.parse(jsonAlphabet),
        randIndex: 0,
        currentScore: 0,
        currentTry: 0,
        tryNumber: 0,
        gameTurnNumber: 20,
        templateString: tmpl,
			
		/** @constructor */
		constructor: function () {
			console.log("app/LaoLetterChallenge@constructor");
		},

        /**
         * @method startup
         * @description final step of dojo lifecycle
         */
		startup: function () {
			console.log("app/LaoLetterChallenge@startup");
			this.inherited(arguments);
			this.own(
                on(this.launchBtnNode, "click", lang.hitch(this, function () {
                    domAttr.set(this.answerInputNode, "value", "");
                    domStyle.set(this.laoLetterNode, "color", "black");
                    domAttr.remove(this.answerInputNode, "disabled"); 
                    this.switchButtonState(false);
                    this.answerInputNode.focus();
                    this.randIndex = Math.floor(Math.random() * this.alphabet.length - 1) + 1;
                    this.laoLetterNode.textContent = this.alphabet[this.randIndex].lao;                    
                })),
                on(this.answerInputNode, "keypress", lang.hitch(this, function (evt) {
                    if (evt.keyCode === keys.ENTER) { 
                        var currentValue = domAttr.get(this.answerInputNode, "value");
                        var currentLetter = this.alphabet[this.randIndex].rom;
                        if (currentValue && (currentValue.toLowerCase() === currentLetter.toLowerCase())) {
                            this.currentScore++;                            
                            domStyle.set(this.laoLetterNode, "color", "green");
                            domAttr.set(this.answerInputNode, "value", "Bravo: " + currentValue);    
                            this.endCurrentLetterTry();
                        }
                        else if (this.tryNumber < 2) {
                            this.tryNumber++;
                            domStyle.set(this.laoLetterNode, "color", "red");
                            setTimeout(lang.hitch(this, function () {
                                domStyle.set(this.laoLetterNode, "color", "black");
                            }), 350);
                            domAttr.set(this.answerInputNode, "value", "");
                        }
                        else {
                            domAttr.set(this.answerInputNode, "value", "Perdu: " + currentLetter); 
                            this.endCurrentLetterTry();
                            
                        }
                        if (this.currentTry < this.gameTurnNumber) {
                            this.scoreNode.textContent = "Score: " + this.currentScore + " / " + this.currentTry;
                        }
                        else {
                            this.scoreNode.textContent = "Final Score: " + this.currentScore + " / " + this.currentTry;
                            this.currentTry = 0;
                            this.currentScore = 0;
                            //domAttr.set(this.answerInputNode, "value", "");
                            //this.laoLetterNode.textContent = "";
                        }
                        
                    }
                }))
			);
		},

        /**
         * @method switchButtonState 
         * @description enable/disable the given button
         * @param  {boolean} onState [description]
         */
        switchButtonState:function (onState) {
            console.log("app/switchButtonState@constructor");
            if (onState) {
                domAttr.remove(this.launchBtnNode, "disabled");  
                domStyle.set(this.launchBtnNode, "cursor", "pointer"); 
            }
            else {
                domAttr.set(this.launchBtnNode, "disabled", "true");
                domStyle.set(this.launchBtnNode, "cursor", "default");
            } 
        },

        endCurrentLetterTry: function () {
            console.log("app/endCurrentLetterTry@constructor");
            domAttr.set(this.playerSourceNode, "src", "/mp3/" + this.alphabet[this.randIndex].song);   
            domAttr.set(this.answerInputNode, "disabled", "true");
            this.playerNode.load();
            this.playerNode.play();
            this.switchButtonState(true);  
            this.launchBtnNode.focus();
            this.tryNumber = 0;
            this.currentTry++; 
        }           
            
	});

});
