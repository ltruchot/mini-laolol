/**
 * @file Chronometer.js
 * @copyright Orange 2015, All Rights Reserved.
 * @author WebTV PC Team - SII Ouest
 * @license This software is the confidential and proprietary information of Orange. You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement you entered into with Orange.
 */

/**
 * @module app/Chronometer
 * @extends wptv/services/common/widgets/MosaicItem
 * @description  A class as dojo module representing a "live service" MosaicItem widget child of a Mosaic parent.
 */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/text!./templates/Chronometer.html'
],

function(declare, lang, on, _WidgetBase, _TemplatedMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin], {

        startTime: 0,
        start: 0,
        end: 0,
        diff: 0,
        timerID: 0,

        /**
         * @member {string} templateString
         * @description the html template
         * @see dijit/_Templated
         */
        templateString: template,

        /**
         * @constructor
         * @description constructor of the object. Initialize members
         */
        constructor: function() {
            console.log('app/Chronometer@constructor');

        },

        /**
         * @method startup
         * @description final step of dojo widget lifecycle - DOM is loaded
         */
        startup: function () {
            this.inherited(arguments);
        },

        launchChrono: function () {
            this.end = new Date();
            this.diff = this.end - this.start;
            this.diff = new Date(this.diff);
            var msec = this.diff.getMilliseconds();
            var sec = this.diff.getSeconds();
            var min = this.diff.getMinutes();
            var hr = this.diff.getHours() - 1;
            if (min < 10) {
                min = '0' + min;
            }
            if (sec < 10) {
                sec = '0' + sec;
            }
            if (msec < 10) {
                msec = '00' + msec;
            }
            else if (msec < 100) {
                msec = '0' + msec;
            }
            this.chronoTimeNode.innerHTML = hr + ':' + min + ':' + sec + ':' + msec;
            this.timerID = setTimeout(lang.hitch(this, function () {
                this.launchChrono();
            }), 10);
        },
        startChrono: function () {
            this.start = new Date();
            this.launchChrono();
        },
        continueChrono: function () {
            this.start = new Date() - this.diff;
            this.start = new Date(this.start);
            this.launchChrono();
        },
        resetChrono: function () {
            this.chronoTimeNode.innerHTML = '0:00:00:000';
            this.start = new Date();
        },
        chronoStopReset: function () {
            this.chronoTimeNode.innerHTML = '0:00:00:000';
        },
        pauseChrono: function () {
            clearTimeout(this.timerID);
        }
    });
});
