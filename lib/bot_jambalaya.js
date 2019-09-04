const Bot = require('./bot');

class Jambalaya extends Bot{

    constructor(name = "Jambalaya!"){
        super(name);

        this.lowCardFirst = true;
    }

    playTurn(){
        var playableCards = this.getPlayableCards().sort( (a,b) => {
            if(this.lowCardFirst){
                return a.value - b.value;     //first play the lower card, then the higher once
            }else{
                return b.value - a.value;
            }
        });
        
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

module.exports = Jambalaya;