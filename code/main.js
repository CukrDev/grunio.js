"use strict";

// import libraries & other stuff
import { kaboom, GAME_HEIGHT, GAME_WIDTH, _Modded, _DEBUG_ } from "../config.js";

// initialize kaboom
kaboom({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
        canvas: document.querySelector("#kaboom"),
        background: [50, 168, 82],
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
}

function __init__(){
    loadSprites()
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


scene("Game", () => {
    var keyrelased = true
    var sleeptimer = 0
    const SPEED = 320
    
    const player = add([
        sprite("Grunio"),
        scale(4),
        pos(center()),
        origin("center"),
        area(),
        body(),
    ])
    
    add([
        rect(width(), 48),
        outline(4),
        area(),
        pos(0, height() - 48),
        solid(),
    ])

    onKeyDown("up", () => {
        if (player.isGrounded()) {
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

    loop(1, () => {

        if (keyrelased = 1) {
            sleeptimer += 1
        } else {
            sleeptimer = 0
        }
    })

    player.onUpdate(() => {
        camPos(player.pos)
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
    addButton("Start", vec2(GAME_WIDTH/2, GAME_HEIGHT/2), 48*1, 200*1, "sinko", () => go("Game"))
})

__init__()
