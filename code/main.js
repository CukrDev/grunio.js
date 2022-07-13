"use strict";

// import libraries & other stuff
import { kaboom, GAME_HEIGHT, GAME_WIDTH, _Modded, _DEBUG_ } from "../config.js";
import { LEVELS } from "../code/levels.js"

// initialize kaboom
kaboom({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
        canvas: document.querySelector("#kaboom"),
        logMax: 10,
});

function loadSprites(){
    loadBean()
    loadRoot("./sprites/")
    loadSprite("Grunio", "grunio.png", {
        sliceX: 4,
        anims: {
            "walk": {
                from: 0,
                to: 2,

                speed: 10
            },
            "idle": 0,
            "sleep": 3
        },
    })
    loadSprite("DirtTile_0", "DirtTile_0.png")
    loadSprite("DirtTile_1", "DirtTile_1.png")
    loadSprite("marchewka", "marchewka.png", {
        sliceX: 8,
        anims: {
            "main": {
                from: 0,
                to: 7,

                loop: true,
                speed: 5,
            }
        },
    })
}

function loadSounds(){
    loadRoot("./sounds/")
    loadSound("marchewka", "marchewka.mp3")
    loadSound("MaxMarchewki", "MaxMarchewki.mp3")
    loadSound("skok", "skok.mp3")
    loadSound("chrapanie", "chrapanie.mp3")
}

function __init__(){
    loadSprites()
    loadSounds()
    go("Menu")
}

function addButton(txt, p, h, w, font, f) {
    
    const btn = add([
        scale(1),
        text(txt, {
            font: font,
            size: h,
            width: w,
        }),
        pos(p),
        area(),
        origin("center"),
        fixed(),
    ])

    btn.onClick(f)

}


const levelConf = {
	// grid size
	width: 64,
	height: 64,
	// define each object as a list of components
	"=": () => [
		sprite("DirtTile_0"),
        scale(4),
		area(),
		solid(),
		origin("bot"),
        "grass",
	],
	"#": () => [
		sprite("DirtTile_1"),
		area(),
        scale(4),
		origin("bot"),
		solid(),
		"dirt",
	],
    "$": () => [
		sprite("marchewka", {
            anim: "main"
        }),
        scale(4),
		origin("bot"),
        area({ width: 18 }),
		"marchewka",
	],
}

scene("Level", ({ levelId, maxmarchewki } = { levelId: 0, maxmarchewki: 11 }) => {
    var marchewki = 0
    var keyrelased = true
    var sleeptimer = 0
    const SPEED = 320
    
    const MarchewkiUI = add([
        text(marchewki+"/"+[maxmarchewki], {
            font:
             "sinko"
        }),
        color(WHITE),
        scale(4),
	    pos(GAME_WIDTH/2-355, GAME_HEIGHT/2+230),
        area(),
        z(99),
        fixed(),
    ])
    
    const player = add([
        sprite("Grunio"),
        scale(4),
        pos(GAME_WIDTH, GAME_HEIGHT),
        origin("bot"),
        area({ width: 18, height: 11. }),
        body(),
    ])
    
    const level = addLevel(LEVELS[levelId ?? 0], levelConf)

    onKeyDown(["up", "space"], () => {
        if (player.isGrounded()) {
            play("skok")
            player.jump()
            if (player.curAnim() !== "idle") {
                player.play("idle")
            }
        }
        keyrelased = 0
        sleeptimer = 0
    })

    onKeyDown("left", () => {
        player.move(-SPEED, 0)
        player.flipX(true)
        if (player.isGrounded() && player.curAnim() !== "walk") {
            player.play("walk")
        }
        keyrelased = 0
        sleeptimer = 0
    })
    
    onKeyDown("right", () => {
        player.move(SPEED, 0)
        player.flipX(false)
        if (player.isGrounded() && player.curAnim() !== "walk") {
            player.play("walk")
        }
        keyrelased = 0
        sleeptimer = 0
    })

    onKeyRelease(["left", "right"], () => {
        // Only reset to "idle" if player is not holding any of these keys
        if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right") && !isKeyDown("up")) {
            player.play("idle")
            keyrelased = 1
        } else {
            keyrelased = 0
            sleeptimer = 0
        }
    })

    player.onCollide("marchewka", (marchewka) => {
		destroy(marchewka)
        marchewki += 1
        MarchewkiUI.text = marchewki+"/"+[maxmarchewki]
        if (marchewki == [maxmarchewki]) {
            MarchewkiUI.color = rgb(235, 128, 52)
            play("MaxMarchewki")
        }
        play("marchewka")
	})

    loop(1, () => {

        if (keyrelased = 1) {
            sleeptimer += 1
        } else {
            sleeptimer = 0
        }
    })

    player.onUpdate(() => {
        camPos(player.pos.x, player.pos.y-90)
        if (sleeptimer > 14) {
            if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right") && !isKeyDown("up")) {
                player.play("sleep")
            }
        }

        if (keyrelased = 0) {
            sleeptimer = 0
        }
    })
})

scene("Menu", () => {
    addButton("Start", vec2(GAME_WIDTH/2, GAME_HEIGHT/2), 48*1, 200*1, "sinko", () => go("Level"))
})

__init__()
