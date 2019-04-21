    // ==UserScript==
    // @name         KalturaPlaybackRateController
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  try to take over the world!
    // @author       Ghaith
    // @match        https://learning.oreilly.com/*
    // @grant        none
    // ==/UserScript==
    /* jshint -W097 */
    'use strict';

    console.log("HTML Speed loaded");

    if(!document.getElementById("zeusCSP")) {
        var script  = document.createElement('SCRIPT');
        script.id   = "zeusCSP";
        script.text = "CSP_AllowInlineScript = true;";
        document.head.appendChild(script);
    }
    if(!CSP_AllowInlineScript) return;
    console.log("Injection Allowed");

    // inject Jquery
    script = document.createElement('script');script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";document.getElementsByTagName('head')[0].appendChild(script);
    console.log("Injected Jquery");

    var v;
    var currentrunperiod = 0;


    function debounce(fn, debounceDuration){

        debounceDuration = debounceDuration || 100;

        return function(){
            if(!fn.debouncing){
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function(){
                fn.debouncing = false;
            }, debounceDuration);

            return fn.lastReturnVal;
        };
    };


    //start main
    //on Keydown listener

    var CurrentPlaybackRate = 1;

    function handle(e){
        v = $(".kWidgetIframeContainer")[0];
        if (v==undefined){
            console.log("not defined");
            return;
        }

        //Debounce
        if(currentrunperiod >  Date.now()) {
            console.log("debounce");
            return;
        }
        currentrunperiod = Date.now()  + (10); //.5sec

        if(e.keyCode == 107 || e.keyCode == 68){// + numpad or D
            CurrentPlaybackRate = CurrentPlaybackRate + 1;
            v.sendNotification('playbackRateChangeSpeed', CurrentPlaybackRate ) ;
            console.log("Speed changed to "+ v.playbackRate);
        }
        if(e.keyCode == 110){//decimal
            CurrentPlaybackRate  = 1;
            v.sendNotification('playbackRateChangeSpeed', 1 ) ;
            console.log("Speed changed to Normal = "+ v.playbackRate);
        }


        if(e.keyCode == 106){// astrik *
            v.sendNotification('playbackRateChangeSpeed', 4 ) ;
            CurrentPlaybackRate = 4 ;
            console.log("Speed changed to Max with Audio = "+ CurrentPlaybackRate);
        }
        if(e.keyCode == 111){// numpad /
            v.sendNotification('playbackRateChangeSpeed', 12 ) ;
            CurrentPlaybackRate = 12 ;

            console.log("Speed changed to Max with/t Audio = "+ 12);
        }

        if(e.keyCode == 13){// numpad enter
            v.sendNotification('playbackRateChangeSpeed', 16 ) ;
            CurrentPlaybackRate = 16 ;
            console.log("Speed changed to Max with/t Audio = "+ 16);
        }
        if(e.keyCode == 109 || e.keyCode == 83){// - numpad or S
            if(v.playbackRate != 1){
                CurrentPlaybackRate = CurrentPlaybackRate -1
                v.sendNotification('playbackRateChangeSpeed', CurrentPlaybackRate ) ;
                console.log("Speed changed to "+ v.playbackRate);
            }
        }

    }


    window.addEventListener("keydown", handle, true);
