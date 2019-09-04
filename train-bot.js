var Bot = require('./lib/bot');
var Jambalaya = require('./lib/bot_jambalaya');
var Vakahla = require('./lib/bot_vakahla');
var Donald = require('./lib/bot_donald');

var AlpacaServer = require('../alpaca/alpaca-server/alpaca-server');    //Path, to the Alpaca Server 

var theAlpacaServer = null;
var scores = Array();

var gamesToPlay = 20;

function setupServer(){
    if(!theAlpacaServer){
         theAlpacaServer = new AlpacaServer();
    }else{
        theAlpacaServer.alpacaGame = null;
        theAlpacaServer.joinedPlayerList = Array();
    }
    theAlpacaServer.expectedPlayer = 4;
    disableDebugMessages();
}


function disableDebugMessages(){
    //return;
    var delayTime = 10;
    if(theAlpacaServer){
        if(theAlpacaServer.alpacaGame){
            theAlpacaServer.alpacaGame.DEBUG = false;
        }else{
            setTimeout(() => {
                disableDebugMessages();
            }, delayTime);
        }
    }else{
        setTimeout(() => {
            disableDebugMessages();
        }, delayTime);
    }
}

function setupBots(){
    var theJohnBot = new Vakahla("John");
    theJohnBot.leavePoints = 2;

    var theLukeBot = new Vakahla("Luke");
    theLukeBot.leavePoints = 5;

    var theMustiBot = new Vakahla("Mustafa");
    theMustiBot.leavePoints = 12;

    var theJanBot = new Vakahla("Vincent");
    theMustiBot.leavePoints = 15;

    theJohnBot.gameEndedCallback = function(score){
        theJohnBot.isActive = false;
        theLukeBot.isActive = false;
        theMustiBot.isActive = false;
        theJanBot.isActive = false;
        
        console.log("")
        console.log(">>>FINISHED GAME ("+gamesToPlay+" to Play)<<<");
        console.log("");
        console.log(score);

        scores.push(score);

        if(gamesToPlay > 0){
            setupServer();
            setupBots();
        }else{
            console.log(">>>>>>>>>END OF BOT TESTS...");
            console.log(scores);
            printSummary();
        }
        gamesToPlay--;
    }.bind(this);
}

function printSummary(){
    var summ = Array();
    var completeSum = 0;
    var avg = Array();
    var rounds = 0;

    console.clear();
    console.log("_____SUMMARY_____");
    console.log();

    scores.forEach( score => {
        for(name in score){
            if(!summ[name])summ[name] = 0;

            summ[name] += score[name];
            completeSum += score[name];
        }
        rounds++;
    });


    
    console.log(rounds+" have been played.");
    console.log("");
    
    for(name in summ){
        avg[name] = parseInt(summ[name] / rounds);
    
        var output = name[0]+": ";
        var percent = summ[name] / completeSum;
        for(var i = 0; i < parseInt(percent*25); i++){
            output += "[]";
        }

        console.log(output);
    }
    console.log("");
        
    
    console.log("Score Summ:");
    console.log(summ);
    console.log("");

    console.log("Score Avg:");
    console.log(avg);
    console.log("");

    console.log("All Scores per Round:");
    console.log(scores);
    console.log("");

    
}


setupServer();
setupBots();


