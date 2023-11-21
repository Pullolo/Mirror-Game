const gameArea = document.getElementById('gameArea');
const counter = document.getElementsByClassName("counter")[0];
let rodsSpawned = 0;
let mouseX;
let mouseY;
let white = document.getElementById("white");
let black = document.getElementById("black");
let score = 0;
let rodWhiteImg = '<img src="imgs/whiterod.png">';
let rodBlackImg = '<img src="imgs/blackrod.png">';
let rodOnCooldown = false;
let time = 0;
let gameLoop = true;

class Player{
    constructor(mirrored){
        this.mirrored = mirrored;
        this.x = 200;
        this.y = 100;
    }
    update(elem){
        if(this.mirrored){
            this.x = window.innerWidth - mouseX;
        } else{
            this.x = mouseX;
        }
        this.y = mouseY;
        this.check();
        elem.style.left = this.x + "px";
        elem.style.top = this.y + "px";
    }
    check(){
        if(this.mirrored){
            if(this.x < window.innerWidth/2 + 40){
                this.x = window.innerWidth/2 + 40;
            }
        }else{
            if(this.x > window.innerWidth/2 -40){
                this.x = window.innerWidth/2 - 40;
            }
        }
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
}

class Rod{
    constructor(SpawnX, SpawnY, speed, ID){
        this.x = SpawnX;
        this.y = SpawnY;
        this.speed = speed;
        this.ID = ID;
        if(this.x>window.innerWidth/2){
            gameArea.innerHTML += `<div class="rod" id="r${this.ID}">${rodBlackImg}</div>`;
        } else{
            gameArea.innerHTML += `<div class="rod" id="r${this.ID}">${rodWhiteImg}</div>`;
        }
        this.elem = document.getElementById(`r${this.ID}`);
    }
    update(){
        this.elem = document.getElementById(`r${this.ID}`);
        this.elem.style.left = this.x + "px";
        this.elem.style.top = this.y + "px";
        this.y += this.speed;
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    remove(){
        this.elem.remove();
    }
}

class Rods{
    constructor(){
        this.rods = [];
    }
    update(player1, player2){
        this.rods.forEach(rod => {
            rod.update();
            if(rod.getY() > window.innerHeight){
                rod.remove();
                this.rods.splice(this.rods.indexOf(rod) , 1);
                score++;
            }
            if ((rod.getX()+40 > player1.getX() && rod.getX()-40 < player1.getX()
            && rod.getY()+50 > player1.getY() && rod.getY()-50 < player1.getY()) || (rod.getX()+40 > player2.getX() && rod.getX()-40 < player2.getX()
            && rod.getY()+50 > player2.getY() && rod.getY()-50 < player2.getY())){
                rod.remove();
                this.rods.splice(this.rods.indexOf(rod) , 1);
                console.log("Game Over!");
                gameLoop = false;
            }
        });
    }
    newRod(x, y, speed, ID){
        this.rods.push(new Rod(x, y, speed, ID));
        rodsSpawned++;
    }
    getRod(ID){
        return this.rods[ID];
    }
    allRods(){
        return this.rods;
    }
}

window.onload = startGame();
document.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
    mouseY = event.clientY;
});
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
function touchHandler(e) {
    if(e.touches) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;        
    }
}

function startGame() {
    let player1 = new Player(false);
    let player2 = new Player(true);

    let rods = new Rods();
    setInterval(() => {
        white = document.getElementById("white");
        black = document.getElementById("black");
        player1.update(white);
        player2.update(black);
        if(gameLoop){
            createRod(0.2, rods);  
            rods.update(player1, player2); 
        }
        counter.innerHTML = score;
    }, 20);
}

function createRod(cooldownSec, rods){
    if(rodOnCooldown === false){
        rodOnCooldown = true;
        time = 1;

        rods.newRod(getRandomInt(0, window.innerWidth), -100, 10, rodsSpawned);
    }
    else{
        if(time % (cooldownSec * 50) === 0){
            rodOnCooldown = false;
        }
        time++;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}