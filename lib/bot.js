const request = require('request');
const config = require('../conf/conf');
const Card = require('./card');

class Bot{

    constructor(name = "Lukas der Zerstörer!"){
        this.DEBUG = true;
        this.isActive = true;

        this.name = name;
        this.id = null;

        this.hand = Array();
        this.coins = Array();
        this.score = 0;
        this.otherPlayers = Array();
        this.myTurn = false;
        this.cardpileCards = null;
        this.discardedCard = null;

        this.gameEndedCallback = null;

        this.networkRegisterPlayer(function(){
            this.gameLoop();
        }.bind(this));
    }

    networkRegisterPlayer(callback){
        request({ uri: (config.host+'/join'), method: 'POST', json: {name: this.name}}, (err, res, body) => {
            if(err || body.player_id === undefined) throw "Could not join Alpaca Server!";

            this.id = body.player_id;

            if(this.DEBUG)console.log(body.player_name + " ("+body.player_id+") has joined the Game!");

            callback();
        });
    }


    networkGetGameState(callback){
        request(config.host+'/alpaca?id='+this.id, { json: true }, (err, res, body) => {
            if (err) throw "Error by calling Gamestate!"; 
            
            this.otherPlayers = body.other_players;
            this.hand = body.hand;
            this.myTurn = body.my_turn;
            this.score = body.score;
            this.coins = body.coins;
            this.cardpileCards = body.cardpile_cards;
            this.discardedCard = body.discarded_card;
            this.playersLeft = body.players_left;

            //console.log(this);
            //throw ("Test for purpose");

            if(callback)callback();
        });
    }

    networkPlayTurn(action = {}, callback){

        if(this.playersLeft <= 1 && action.action === 'DRAW CARD'){
            action.action = 'LEAVE ROUND';
        }

        request({ uri: (config.host+'/alpaca?id='+this.id), method: 'POST', json: action}, (err, res, body) => {
            if(err)throw "Error by playing my turn";
            if(res.statusCode === 500){
                console.log(body);
                throw "Server error: "+body.error.message;
            }

            console.log(">>>>>>>>"+res.statusCode);

            if(callback)callback();
        });
    }

    gameLoop(){
        if(!this.isActive)return;

        if(this.myTurn){
            this.playTurn();
        }

        this.checkGameEnded();

        this.networkGetGameState(
            function(){
                    setTimeout(() => {
                    this.gameLoop();
                }, config.timeout);
            }.bind(this)
        );
    }

    playTurn(){
        var playableCards = this.getPlayableCards();
        
        if(playableCards.length <= 0){
            if(this.cardpileCards > 0){
                this.networkPlayTurn({action: 'DRAW CARD'});
            }else{
                this.networkPlayTurn({action: "LEAVE ROUND"});
            }
        }else{
            this.networkPlayTurn({action: "DROP CARD", card: playableCards[0].name});
        }
    }

    getPlayableCards(){
        return this.hand.filter( card => {
            return Card.PLAYABLE(card, this.discardedCard);
        });
    }

    checkGameEnded(){
        var stopGame = false;
        var score = {};
        if(this.score > 40)stopGame = true;
        score[this.name] = this.score;
        if(this.otherPlayers){
            this.otherPlayers.forEach( player => {
                for(var key in player){
                    if(player[key].score > 40)stopGame = true;
                    score[key] = player[key].score;
                }
            });
        }
        if(stopGame && this.gameEndedCallback)this.gameEndedCallback(score);
    }
}

module.exports = Bot;