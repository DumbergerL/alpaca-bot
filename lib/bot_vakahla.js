const Bot = require('./bot');

class Vakahla extends Bot{

    constructor(name = "Vakahla!", callbackMode = false, port=8080){
        super(name, callbackMode, port);

        this.lowCardFirst = true;
        this.leavePoints = 15.5;
    }

    playTurn(){
        var playableCards = this.getPlayableCards().sort( (a,b) => {
            if(this.lowCardFirst){
                return a.value - b.value;     //first play the lower card, then the higher once
            }else{
                return b.value - a.value;
            }
        });

        var points = 0;
        var alreadyAccounted = Array();
        this.hand.forEach( card => {
            if(alreadyAccounted.indexOf( card.type ) === -1){
                points += card.value;
                alreadyAccounted.push( card.type );
            }
        });

        if(points < this.leavePoints){
            this.networkPlayTurn({action: 'LEAVE ROUND'});
        }

        
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
}

module.exports = Vakahla;