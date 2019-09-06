var Vakahla = require('./lib/bot_vakahla');
var Donald = require('./lib/bot_donald');
var Jambalaya = require('./lib/bot_jambalaya');


var theJohnBot = new Jambalaya("John", true, 8081);

var theLukasBot = new Jambalaya("Lukas", true, 8082);

var theMustiBot = new Jambalaya("Mustafa", true, 8080); 
theMustiBot.leavePoints = 3;

var theJanBot = new Vakahla("Jan", true, 8083); 
theJanBot.leavePoints = 3;


