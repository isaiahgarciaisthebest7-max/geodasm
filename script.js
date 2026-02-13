const player = document.getElementById("player");
const game = document.getElementById("game");
const statusText = document.getElementById("status");

let gravity = 0.9;
let velocity = 0;
let bottom = 0;
let mode = "cube";
let waveDir = 1;
let running = false;
let speed = 5;
let loop;

const GROUND = 0;
const CEILING = 260;

document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (!running) startGame();
        input();
    }
});

function startGame() {
    running = true;
    statusText.innerText = "Good Luck 😈";
    createLevel();
    loop = setInterval(update, 20);
}

function createLevel() {

    const spikeLayout = [
        500, 650, 800, 950, 1200, 1350, 1600, 1900
    ];

    spikeLayout.forEach(pos => {
        let spike = document.createElement("div");
        spike.className = "spike";
        spike.style.left = pos + "px";
        game.appendChild(spike);
    });

    const modes = ["ship", "ball", "ufo", "wave", "cube"];
    const portals = [700, 1100, 1500, 1800, 2100];

    for (let i = 0; i < modes.length; i++) {
        let portal = document.createElement("div");
        portal.className = "portal";
        portal.dataset.mode = modes[i];
        portal.style.left = portals[i] + "px";
        game.appendChild(portal);
    }
}

function input() {

    if (mode === "cube") {
        if (bottom === GROUND) velocity = 15;
    }

    else if (mode === "ship") {
        velocity = 7;
    }

    else if (mode === "ball") {
        gravity *= -1;
    }

    else if (mode === "ufo") {
        velocity = 12;
    }

    else if (mode === "wave") {
        waveDir *= -1;
    }
}

function update() {

    // Physics
    if (mode === "cube" || mode === "ufo") {
        velocity -= gravity;
        bottom += velocity;
    }

    if (mode === "ship") {
        velocity -= gravity * 0.5;
        bottom += velocity;
    }

    if (mode === "wave") {
        bottom += waveDir * 6;
    }

    // Clamp
    if (bottom <= GROUND) {
        bottom = GROUND;
        velocity = 0;
    }

    if (bottom >= CEILING) {
        bottom = CEILING;
        velocity = 0;
    }

    player.style.bottom = bottom + "px";

    moveObjects();
    collisions();
}

function moveObjects() {
    document.querySelectorAll(".spike, .portal").forEach(obj => {
        let left = parseFloat(obj.style.left);
        obj.style.left = (left - speed) + "px";
    });
}

function collisions() {

    const p = player.getBoundingClientRect();

    document.querySelectorAll(".spike").forEach(spike => {
        const s = spike.getBoundingClientRect();

        if (
            p.left + 8 < s.right &&
            p.right - 8 > s.left &&
            p.bottom - 8 > s.top &&
            p.top + 8 < s.bottom
        ) {
            death();
        }
    });

    document.querySelectorAll(".portal").forEach(portal => {
        const r = portal.getBoundingClientRect();
        if (
            p.left < r.right &&
            p.right > r.left &&
            p.bottom > r.top &&
            p.top < r.bottom
        ) {
            mode = portal.dataset.mode;
            player.style.background = randomColor();
        }
    });
}

function death() {
    clearInterval(loop);
    statusText.innerText = "💀 You Died - Refresh";
}

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}
