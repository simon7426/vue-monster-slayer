function monsterAction(){
    const monsterAction = Math.floor(Math.random() * (4));
    actions = ['attack','specialAttack','heal','defence','surrender'];
    return actions[monsterAction];
}
function getRandomValue(min,max){
    return Math.floor(Math.random() * (max-min) + min);
}
const app  = Vue.createApp({
    data(){
        return {
            'playerHealth': 100,
            'monsterHealth': 100,
            'roundNo': 1,
            'lastSpecialAttack': -4,
            'gameStatus': 'running',
            'battleLog': [],
        };
    },
    computed: {
        monsterBarStyles() {
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles() {
            return {width: this.playerHealth + '%'};
        },
        specialAttackButtonActivate(){
            if(this.lastSpecialAttack + 3 >= this.roundNo){
                console.log("here");
                return true;
            }
        },
    }
    ,
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <=0 ){
                this.gameStatus = 'draw';
            }
            else if (value <= 0) {
                this.gameStatus = 'lost';
            }
        },
        monsterHealth(value) {
            if ( value<=0 && this.playerHealth <= 0){
                this.gameStatus = 'draw';
            }
            else if (value <= 0){
                this.gameStatus = 'win';
            }
        },
    }
    ,
    methods: {
        healthBalance() {
            if(this.playerHealth < 0 ){
                this.playerHealth = 0;
            }
            if(this.monsterHealth < 0){
                this.monsterHealth = 0;
            }
            if(this.playerHealth > 100 ){
                this.playerHealth = 100;
            }
            if(this.monsterHealth > 100){
                this.monsterHealth = 100;
            }
        },
        attackMonster(){
            currMonsterAction = monsterAction();
            console.log(currMonsterAction);
            var playerAttackValue = getRandomValue(5,15);
            var monsterAttackValue = getRandomValue(3,13);
            console.log(playerAttackValue,monsterAttackValue);
            this.playerHealth -= monsterAttackValue;
            this.addLogMessage('you','attack',playerAttackValue);
            this.monsterHealth -= playerAttackValue;
            this.addLogMessage('monster','attack',monsterAttackValue);
            this.healthBalance();
            this.roundNo++;
        },
        specialAttackMonster(){
            this.lastSpecialAttack = this.roundNo;
            const playerAttackValue = getRandomValue(10,25);
            this.addLogMessage('you','special attack',playerAttackValue);
            this.monsterHealth -= playerAttackValue;
            const monsterAttackValue = getRandomValue(3,30);
            this.addLogMessage('monster','attack',playerAttackValue);
            this.playerHealth -= monsterAttackValue;
            this.roundNo++;
            this.healthBalance();
        },
        healPlayer(){
            const playerHealValue = getRandomValue(10,20);
            currMonsterAction = monsterAction();
            if (currMonsterAction === 'heal' || currMonsterAction === 'defence'){
                this.playerHealth += playerHealValue;
                this.addLogMessage('you','heal',playerHealValue);
            }
            else {
                monsterAttackValue = getRandomValue(3,13);
                this.playerHealth -= monsterAttackValue;
                this.addLogMessage('monster','attack',monsterAttackValue);
            }
            this.healthBalance();
        },
        surrenderPlayer(){
            this.gameStatus = 'lost';
            this.addLogMessage('you','surrender',0);
        },
        newGame(){
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.roundNo = 1;
            this.lastSpecialAttack = -4;
            this.gameStatus = 'running';
            this.battleLog = [];
        },
        addLogMessage(who, what, value){
            this.battleLog.unshift({
                'round': this.roundNo,
                'actionby': who,
                'actionType': what,
                'actionValue': value,
            })
        }
        
    }
});

app.mount('#game');