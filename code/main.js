"use strict";

// import libraries & other stuff
import { kaboom, GAME_HEIGHT, GAME_WIDTH, _Modded, _DEBUG_ } from "../config.js";

// initialize kaboom
kaboom({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
        crisp: true,
        canvas: document.querySelector("#kaboom"),
        background: [50, 168, 82],
        logMax: 10,
});

function loadSprites(){
    loadBean()
    loadSprite("Grunio", "sprites/grunio.png")
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
    const SPEED = 320
    
    const player = add([
        sprite("Grunio"),
        scale(4),
        pos(center()),
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
        }
    })

    onKeyDown("left", () => {
        // .move() is provided by pos() component, move by pixels per second
        player.move(-SPEED, 0)
        player.flipX(false)
    })
    
    onKeyDown("right", () => {
        player.move(SPEED, 0)
        player.flipX(true)
    })
})

scene("Menu", () => {
    addButton("Start", vec2(GAME_WIDTH/2, GAME_HEIGHT/2), 48*1.6, 200*1.6, "sinko", () => go("Game"))
})

__init__()