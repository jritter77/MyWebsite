
//Get Canvas Info/////////////////////////////////

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

///////////////////////////////////////////////////


//Set Key Variables//////////////////////////////

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;
var pPressed = false;

//////////////////////////////////////////////////


//Set Listeners///////////////////////////////////

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

///////////////////////////////////////////////////


//Handler Functions/////////////////////////////////

function keyDownHandler(e){
	if(e.key == "Right" || e.key == "ArrowRight") {
		e.preventDefault();
		rightPressed = true;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		e.preventDefault();
		leftPressed = true;
	}
	else if(e.key == "Up" || e.key == "ArrowUp") {
		e.preventDefault();
		upPressed = true;
	}
	else if(e.key == "Down" || e.key == "ArrowDown") {
		e.preventDefault();
		downPressed = true;
	}
	else if(e.key == " " || e.key == "Spacebar") {
		e.preventDefault();
		spacePressed = true;
	}
	else if(e.key == "p") {
		e.preventDefault();
		pPressed = true;
	}
}

function keyUpHandler(e){
	if(e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
	else if(e.key == "Up" || e.key == "ArrowUp") {
		upPressed = false;
	}
	else if(e.key == "Down" || e.key == "ArrowDown") {
		downPressed = false;
	}
	else if(e.key == " " || e.key == "Spacebar") {
		spacePressed = false;
	}
}

function mouseMoveHandler(e) {
	//mouse move action here
}

///////////////////////////////////////////////////////

//General Functions//////////////////////////////////////

function objDistance(a, b){		//finds the distance between 2 objects
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var dist = Math.sqrt(dx*dx + dy*dy);
	return dist;
}

function dist(ax, ay, bx, by){
	var dx = ax - bx;
	var dy = ay - by;
	var d = Math.sqrt(dx*dx + dy*dy);
	return d;
}


function arrFindIndex(arr, value){
	for (var i=0; i<arr.length; i++){
		if (arr[i] == value)return i;
	}
	return (-1);
}

function setPoints(){
	var theta = 0;
	var rad = Math.random()*16+16;
	for (var i=0; i<6; i++){
		theta += Math.random()*(Math.PI/3)+(Math.PI/6);
		this.dPoints.push({a: theta, r: rad}); 
	}
}


/////////////////////////////////////////////////////


//Set Game Variables//////////////////////////////

var screen = "game";

var pause = false;
var lives = 3;
var score = 0;

var bullets = []; 	//declare bullets array
var enemyBullets = []; 	//declare enemy bullet array
var field = []; 	//declare field array
var enemies = []; 	//declare enemy array
var powerUps = [];	//declare poweUp array
var stars = [];		//declare stars array

var asteroidTimer = Math.random()*60 + 30;
var enemyTimer = Math.random()*60 + 60;

var asteroidImg = document.getElementById("asteroidImg");

/////////////////////////////////////////////////


//Player Object///////////////////////////////////

function Player() {
	this.x = canvas.width/2;
	this.y = canvas.height - 64;
	this.speed = 5;
	
	this.weapon = cannon;
	this.pTracker = [0, 0, 0];

	this.health = 10;

	this.hit = 0;

	this.boundX = 0;
	this.boundY = 16;
	this.boundR = 16;

	this.step = function (){
		movePlayer();
		shoot(this.pTracker, this.weapon, this);
		
		if (this.hit > 0)this.hit--;
	}
}

////////////////////////////////////////////////////


//Enemy Objects/////////////////////////////////////

function Drone() {
	this.x = Math.random()*canvas.width;
	this.y = -20;
	this.speed = 3;
	this.weapon = burstCannon;
	this.pTracker = [0, 0, 0];

	this.health = 2;
	this.power = 1;
	this.hit = 0;

	this.points = 100;

	this.boundX = 0;
	this.boundY = -16;
	this.boundR = 16;

	this.draw = drawDrone;
	this.step = function (){
		shoot(this.pTracker, this.weapon, this);
		if (this.hit>0)this.hit--;
		if (this.health<1){
			score += this.points;
			enemies.splice(arrFindIndex(enemies, this), 1);
			if (Math.random()<.15)powerUps.push(new cannonUpgrade(this.x, this.y));
		}

		this.y += this.speed;
	}
}

function Hunter() {
	this.x = Math.random()*canvas.width;
	this.y = -20;
	this.speed = 3;
	this.weapon = aimedCannon;
	this.pTracker = [0, 0, 0];

	this.health = 5;
	this.power = 1;
	this.hit = 0;

	this.points = 200;

	this.boundX = 0;
	this.boundY = -16;
	this.boundR = 16;

	this.draw = drawHunter;
	this.step = function (){
		shoot(this.pTracker, this.weapon, this);
		if (this.hit>0)this.hit--;
		if (this.health<1){
			score += this.points;
			enemies.splice(arrFindIndex(enemies, this), 1);
			if (Math.random()<.15)powerUps.push(new cannonUpgrade(this.x, this.y));
		}
		
		if (this.y<canvas.height/2)this.y += this.speed;
	}
}

////////////////////////////////////////////////////


//Random Enemy Function////////////////////////////

function randomEnemy(){
	var i = Math.random();

	if (i < .25){
		return (new Hunter);
	}
	else{
		return (new Drone);
	}
}

///////////////////////////////////////////////////


//Gun Objects//////////////////////////////////////

var cannon = {
	pType: Bullet,
	pCount: 1,
	pRate: 5,
	pRest: 10,
	shot: single
}

var doubleCannon = {
	pType: Bullet,
	pCount: 1,
	pRate: 5,
	pRest: 10,
	shot: double
}

var burstCannon = {
	pType: Bullet,
	pCount: 3,
	pRate: 3,
	pRest: 20,
	shot: single
}

var rapidCannon = {
	pType: Bullet,
	pCount: 1,
	pRate: 5,
	pRest: 5,
	shot: single
}

var spreadCannon = {
	pType: Bullet,
	pCount: 1,
	pRate: 5,
	pRest: 15,
	shot: spread
}

var aimedCannon = {
	pType: Bullet,
	pCount: 1,
	pRate: 5,
	pRest: 20,
	shot: aimed
}




///////////////////////////////////////////////////////


//Projectile Objects/////////////////////////////////

function Bullet(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.velocity = [dx, dy];
	this.size = 5;

	this.power = 1;

	this.boundX = 0;
	this.boundY = 0;
	this.boundR = this.size;	

	this.draw = drawBullet;
}

/////////////////////////////////////////////////////



//Field Objects//////////////////////////////////////
function Asteroid() {
	this.x = Math.random()*canvas.width;
	this.y = -20;
	this.velocity = [Math.random()-.5, Math.random()*5 + 2];
	
	this.theta = 0;
	this.spin = Math.PI*(-2+Math.random()*4)/90;
	this.dPoints = [];
	setPoints.call(this);
	
	this.size = this.dPoints[0].r;

	this.health = Math.floor(this.size/4);
	this.power = 1;
	this.hit = 0;

	this.points = 50;

	this.boundX = 0;
	this.boundY = 0;
	this.boundR = this.size;
	
	this.draw = drawAsteroid;
	this.step = function (){
		if (this.hit>0)this.hit--;
		if (this.health<1){
			score += this.points;
			field.splice(arrFindIndex(field, this), 1);
			if (Math.random()<.15)powerUps.push(new repairKit(this.x, this.y));
		}
		this.theta += this.spin;
	}
}

///////////////////////////////////////////////////

//Choose Upgrade Function//////////////////////////

function chooseUpgrade(){
	var n = Math.floor(Math.random()*4);

	switch (n){
		case (0):
			return (rapidCannon);
		case (1):
			return (spreadCannon);
		case (2):
			return (burstCannon);
		case (3):
			return (doubleCannon);
		default:
			return (cannon);
	}
	
}

//////////////////////////////////////////////////

//Power Up Objects////////////////////////////////

function repairKit(x, y){
	this.x = x;
	this.y = y;
	this.velocity = [0, 1];
	this.size = 10;

	this.boundX = 0;
	this.boundY = 0;
	this.boundR = this.size;
	
	this.draw = drawRepairKit;
	this.effect = function(){
		if (player.health<7){
			player.health += 3;
		}
		else{
			player.health = 10;
		}
	}
}


function cannonUpgrade(x, y){
	this.x = x;
	this.y = y;
	this.velocity = [0, 1];
	this.size = 10;
	this.upgrade = chooseUpgrade();

	this.boundX = 0;
	this.boundY = 0;
	this.boundR = this.size;
	
	this.draw = drawCannonUpgrade;
	this.effect = function(){
		player.weapon = this.upgrade;
	}
}

/////////////////////////////////////////////////


//Background Objects//////////////////////////////

function Star(x, y) {
	this.x = x;
	this.y = y;
	this.size = Math.random() + 1;
	this.speed = Math.random() + 1;
	this.draw = drawStar;
}

/////////////////////////////////////////////////


//Player Move Function////////////////////////////////

function movePlayer(){

	if (rightPressed == true){
		if (player.x + player.speed <= canvas.width-10){
			player.x += player.speed;
		}
	}
	
	if (leftPressed == true){
		if (player.x - player.speed >= 10){
			player.x -= player.speed;
		}
	}

	if (upPressed == true){
		if (player.y - player.speed >= 10){
		player.y -= player.speed;
		}
	}
	
	if (downPressed == true){
		if (player.y + player.speed <= canvas.height){
			player.y += player.speed;
		}
	}
}

////////////////////////////////////////////////////////


//Pause Function////////////////////////////////////////

function detectPause(){
	if (pPressed == true){
		if (pause == false){
			pause = true;
		}
		else{
			pause = false;
		}
		pPressed = false;
	}
}

////////////////////////////////////////////////////////


//Shot Type Functions//////////////////////////////////

function single(arr, pType, owner){
	arr.push(new pType(owner.x, owner.y, 0, 10));
}

function double(arr, pType, owner){
	arr.push(new pType(owner.x+10, owner.y, 0, 10));
	arr.push(new pType(owner.x-10, owner.y, 0, 10));
}

function spread(arr, pType, owner){
	arr.push(new pType(owner.x, owner.y, -2, 10));
	arr.push(new pType(owner.x, owner.y, 0, 10));
	arr.push(new pType(owner.x, owner.y, 2, 10));
}

function aimed(arr, pType, owner){				//enemy only shot type
	var dx = -(owner.x - player.x);
	var dy = -(owner.y - player.y);
	var dist = objDistance(owner, player);
	var speed = 5;

	arr.push(new pType(owner.x, owner.y, (dx/dist)*speed, (dy/dist)*speed));
}

//////////////////////////////////////////////////////


//Shoot Weapon Function////////////////////////////////

function shoot(pTracker, weapon, owner){
	var arr = (owner == player) ? bullets : enemyBullets;
	var rest = (owner == player) ? weapon.pRest : weapon.pRest*5;
	
	if ((owner==player && (pTracker[0]>0 || spacePressed==true)) || owner!=player){
		if (pTracker[0] < weapon.pCount){
			if (pTracker[1]>0){
				pTracker[1]--;
			}
			else{
				weapon.shot(arr, weapon.pType, owner);
				pTracker[0]++;
				pTracker[1] = weapon.pRate;
			}
		}
		else{
			if (pTracker[2]<rest){
				pTracker[2]++;
			}
			else{
				for (var i=0; i<pTracker.length; i++){
					pTracker[i] = 0;
				}
			}
		}
	}
}

///////////////////////////////////////////////////////


//Generator Functions//////////////////////////////////////

function generateAsteroids(){	
	if (asteroidTimer <= 0){
		field.push(new Asteroid);
		asteroidTimer = Math.random()*60 + 30;
	}
	else{
		asteroidTimer--;
	}
}


function generateEnemies(){	
	if (enemyTimer <= 0){
		enemies.push(randomEnemy());
		enemyTimer = Math.random()*60 + 60;
	}
	else{
		enemyTimer--;
	}
}


function populateStars(){
	for (var i=0; i<100; i++){
		stars.push(new Star(Math.random()*canvas.width, Math.random()*canvas.height));
	}
}


function starRegeneration(){
	for(var i=0; i<stars.length; i++){
		if (stars[i].y > canvas.height + 20){
			stars.splice(i, 1);
			i--;
			stars.push(new Star(Math.random()*canvas.width, -10));
			break;
		}
	}
}

////////////////////////////////////////////////////////


//Clear Functions//////////////////////////////////////

function removeOffScreen(){
	for(var i=0; i<field.length; i++){
		if (field[i].y > canvas.height + 20){
			field.splice(i, 1);
		}
	}
	for(var i=0; i<enemies.length; i++){
		if (enemies[i].y > canvas.height + 20){
			enemies.splice(i, 1);
		}
	}
			
}


function clearBullets(){
	for(var i=0; i<bullets.length; i++){
		if (bullets[i].y < 0){
			bullets.splice(i, 1);
		}
	}
	for(var i=0; i<enemyBullets.length; i++){
		if (enemyBullets[i].y > canvas.height + 20){
			enemyBullets.splice(i, 1);
		}
	}
			
}

///////////////////////////////////////////////////////


//Collision Detection//////////////////////////////////////////

function collisionCircle(a, b){
	let dx = (a.x+a.boundX) - (b.x+b.boundX);
	let dy = (a.y+a.boundY) - (b.y+b.boundY);
	dist = Math.sqrt(dx*dx + dy*dy)

	if (a.boundR + b.boundR > dist){
		return true;
	}
}


function bulletCollision() {
	for(var i=0; i<bullets.length; i++){
		for (var j=0; j<field.length; j++){
			if (collisionCircle(bullets[i], field[j]) == true){
				field[j].health -= bullets[i].power;
				field[j].hit = 5;
				bullets.splice(i, 1);
				i--;
				break;
			}
		}
	}
	for(var i=0; i<bullets.length; i++){
		for (var j=0; j<enemies.length; j++){
			if (collisionCircle(bullets[i], enemies[j]) == true){
				enemies[j].health -= bullets[i].power;
				enemies[j].hit = 5;
				bullets.splice(i, 1);
				i--;
				break;
			}
		}
	}
}



function playerCollision() {
	for(var i=0; i<field.length; i++){
		if (collisionCircle(player, field[i]) == true){
			player.health -= field[i].power;
			player.hit = 5;
			field.splice(i, 1);
			i--;
			break;
		}
	}
	for(var i=0; i<enemies.length; i++){
		if (collisionCircle(player, enemies[i]) == true){
			player.health -= enemies[i].power;
			player.hit = 5;
			enemies.splice(i, 1);
			i--;
			break;
		}
	}
	for(var i=0; i<enemyBullets.length; i++){
		if (collisionCircle(player, enemyBullets[i]) == true){
			player.health -= enemyBullets[i].power;
			player.hit = 5;
			enemyBullets.splice(i, 1);
			i--;
			break;
		}
	}
	for(var i=0; i<powerUps.length; i++){
		if (collisionCircle(player, powerUps[i]) == true){
			powerUps[i].effect();
			powerUps.splice(i, 1);
			i--;
			break;
		}
	}
}

//////////////////////////////////////////////////////////////


//Game Over Function//////////////////////////////////////////

function gameOver(){
	rightPressed = false;
	leftPressed = false;
	upPressed = false;
	downPressed = false;
	spacePressed = false;
	pPressed = false;
	
	pause = false;

	bullets = []; //declare bullets array
	enemyBullets = []; //declare enemy bullet array
	field = []; //declare field array
	powerUps = [];
	enemies = []; //declare enemy array
	asteroidTimer = Math.random()*60 + 30;
	enemyTimer = Math.random()*60 + 60;

	player = new Player();
	score = 0;
	lives = 3;
}

//////////////////////////////////////////////////////////////


//Draw Object Functions///////////////////////////////////////

function drawPlayer(){
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(player.x+12, player.y+32);
	ctx.lineTo(player.x, player.y+24);
	ctx.lineTo(player.x-12, player.y+32);
	ctx.fillStyle = (player.hit>0) ? "white" : "red";
	ctx.fill();
	ctx.closePath();
}

function drawHealth(){	
	ctx.beginPath();
	ctx.rect(16, 228, 16, -player.health*16);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawDrone(){
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x+12, this.y-32);
	ctx.lineTo(this.x, this.y-24);
	ctx.lineTo(this.x-12, this.y-32);
	ctx.fillStyle = (this.hit>0) ? "white" : "blue";
	ctx.fill();
	ctx.closePath();
}

function drawHunter(){
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x+12, this.y-32);
	ctx.lineTo(this.x, this.y-24);
	ctx.lineTo(this.x-12, this.y-32);
	ctx.fillStyle = (this.hit>0) ? "white" : "orange";
	ctx.fill();
	ctx.closePath();
}

function drawBullet(){
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
	ctx.fillStyle = "gold";
	ctx.fill();
	ctx.closePath();
}

function drawStar(){
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawBullets(){
	for (var i=0; i<bullets.length; i++){
		bullets[i].draw();
		bullets[i].x -= bullets[i].velocity[0];
		bullets[i].y -= bullets[i].velocity[1];
	}
}

function drawEnemyBullets(){
	for (var i=0; i<enemyBullets.length; i++){
		enemyBullets[i].draw();
		enemyBullets[i].x += enemyBullets[i].velocity[0];
		enemyBullets[i].y += enemyBullets[i].velocity[1];
	}
}


function drawAsteroid(){
	ctx.beginPath();
	for (var i=0; i<this.dPoints.length; i++){
		if (i==0){
			ctx.moveTo(this.x+(Math.cos(this.theta+this.dPoints[i].a)*this.dPoints[i].r), this.y-(Math.sin(this.theta+this.dPoints[i].a)*this.dPoints[i].r));
		}
		else{
			ctx.lineTo(this.x+(Math.cos(this.theta+this.dPoints[i].a)*this.dPoints[i].r), this.y-(Math.sin(this.theta+this.dPoints[i].a)*this.dPoints[i].r));
		}
	}
	ctx.fillStyle = (this.hit>0) ? "white" : "green";
	ctx.fill();
	ctx.closePath();
}

function drawField(){
	for (var i=0; i<field.length; i++){
		field[i].draw();
		field[i].x += field[i].velocity[0];
		field[i].y += field[i].velocity[1];
	}
}

function drawPowerUps(){
	for (var i=0; i<powerUps.length; i++){
		powerUps[i].draw();
		powerUps[i].x += powerUps[i].velocity[0];
		powerUps[i].y += powerUps[i].velocity[1];
	}
}

function drawEnemies(){
	for (var i=0; i<enemies.length; i++){
		enemies[i].draw();
	}
}

function drawStars(){
	for (var i=0; i<stars.length; i++){
		stars[i].draw();
		stars[i].y += stars[i].speed;
	}
}

function drawScore(){
	ctx.font = "30px Arial";
	ctx.fillStyle = "gold";
	ctx.fillText(score, 10, 30);
}

function drawLives(){
	var x = 16;
	var y = 32;
	for (var i=0; i<lives; i++){
		ctx.beginPath();
		ctx.moveTo(x+x*i, y);
		ctx.lineTo(x+x*i+6, y+16);
		ctx.lineTo(x+x*i, y+12);
		ctx.lineTo(x+x*i-6, y+16);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
	}
}

function drawPause(){
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.rect(canvas.width/2-192, canvas.height/2-96, 384, 128);
	ctx.stroke();
	ctx.closePath();
	ctx.font = "80px Arial";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("PAUSED", canvas.width/2, canvas.height/2);
}

function drawRepairKit(){
	ctx.beginPath();
	ctx.moveTo(this.x, this.y-12);
	ctx.lineTo(this.x+12, this.y);
	ctx.lineTo(this.x, this.y+12);
	ctx.lineTo(this.x-12, this.y);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawCannonUpgrade(){
	ctx.beginPath();
	ctx.moveTo(this.x, this.y-12);
	ctx.lineTo(this.x+12, this.y);
	ctx.lineTo(this.x, this.y+12);
	ctx.lineTo(this.x-12, this.y);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
}

///////////////////////////////////////////////////////////////

//Draw Image Example//////////////////////////////

function drawImg(){
	ctx.drawImage(img, player.x - img.width/2, player.y - img.height/4, 96, 96);
}

///////////////////////////////////////////////////


//Game Initializers/////////////////////////////////////

var player = new Player();
populateStars();

//////////////////////////////////////////////////////////////


//Main Function///////////////////////////////////////////

function main(){
	
	if (pause == false){
		

		//Player Functions/////////////////////

		player.step();
		
		//////////////////////////////////////

		//Enemy Functions/////////////////////

		for (var i=0; i<enemies.length; i++){
			enemies[i].step();
		}

		//////////////////////////////////////

		//Field Functions//////////////////////	

		for (var i=0; i<field.length; i++){
			field[i].step();
		}
		
		//////////////////////////////////////

		//Object Generator Functions//////////

		generateAsteroids();	//spawns asteroids
		generateEnemies();	//spawns enemies

		//////////////////////////////////////
		
		//Object Clear Functions//////////////////////////////////
		
		removeOffScreen();	//removes offscreen objects from "field" array
		clearBullets();		//removes offscreen objects from "bullets" array
		starRegeneration();	//regenerates stars

		//////////////////////////////////////////////////////////
		
		//Collision Functions//////////////////////////////////////
		
		playerCollision();	//detects collision between arrays and player
		bulletCollision();	//detects collision between objects in "bullets" and "field" arrays

		/////////////////////////////////////////////////////////////

		//Game Functions///////////////////////

		if (player.health <= 0){
			if (lives<1){
				gameOver();
			}
			else{
				player = new Player();
				lives--;
			}
		}
			
		///////////////////////////////////////

		//Draw Functions/////////////////////////////////////////////////////////////////
		
		ctx.clearRect(0, 0, canvas.width, canvas.height); //clears screen for new draw frame.
		drawStars();		//draws stars
		drawPlayer();		//draws player
		drawField();		//draws all objects in "field" array
		drawPowerUps();
		drawEnemies();		//draws all objects in "enemies" array
		drawBullets(); 		//draws all objects in "bullets" array
		drawEnemyBullets();	//draws all objects in "enemyBullets" array
		drawHealth();		//draws health bar
		drawScore();		//draws score
		drawLives();
		
		//////////////////////////////////////////////////////////////////////////////////

	}
	
	detectPause();	//pause the game when "p" is pressed
	if (pause == true)drawPause();
	
	requestAnimationFrame(main); 	//lets browser decide framerate, and makes draw loop.
}
	
/////////////////////////////////////////////////////////////////////

main(); //call main function