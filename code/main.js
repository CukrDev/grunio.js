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
    loadSprite("click", "click.png")
    loadSprite("BeeHive1", "BeeHive1.png")
    loadSprite("BeeHive2", "BeeHive2.png")
    loadSprite("BeeHive3", "BeeHive3.png")
    loadSprite("BeeHive4", "BeeHive4.png")
    loadSprite("CollectBtn", "CollectBtn.png")
    loadSprite("Bee", "Bee.png")
    loadSprite("BackBtn", "Back btn.png")
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
    var cash = 0
    var randombee = 0
    var random = 0

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addClickButton(sp, p, s, f) {
    
        const clickbtn = add([
            sprite(sp),
            scale(s),
            pos(p),
            area(),
            origin("center"),
            z(99),
            fixed(),
        ])
    
        clickbtn.onClick(f)
    
    }
    
    
    // setup sprites
    addClickButton("CollectBtn", vec2(GAME_WIDTH/2, GAME_HEIGHT-150), 6, () => click())
    addClickButton("BackBtn", vec2(GAME_WIDTH-115, GAME_HEIGHT-40), 4, () => wait())

    function spawnBee() {

        const dir = choose([LEFT, RIGHT])
        
        getRandomIntInclusive(0, 1)

        if (random==1) {
            const bee = add([
                sprite("Bee", { flipX: dir.eq(LEFT) }),
                scale(6),
                move(dir, rand(20, 60)),
                cleanup(),
                pos(dir.eq(LEFT) ? width() : 0, rand(-20, 480)),
                origin("top"),
                area(),
                z(1),
            ])
        } else {
            const bee = add([
                sprite("Bee", { flipX: dir.eq(LEFT) }),
                scale(6),
                move(dir, rand(20, 60)),
                cleanup(),
                pos(dir.eq(LEFT) ? width() : 0, rand(-20, 480)),
                origin("top"),
                area(),
                z(0),
            ])
        }


    
        wait(rand(6, 12), spawnBee)
    
    }

    const BeeHive1 = add([
        sprite("BeeHive1"),
        scale(17),
        pos(GAME_WIDTH/2, GAME_HEIGHT/2),
        area(),
        origin("center"),
        z(1),
        fixed(),
        { "Honey":0 },
        { "DefaultHoney":48 },
        { "MaxHoney":50 }
    ])
    
    const HiveText = add([
        text(BeeHive1.honey+" / "+BeeHive1.maxHoney, {
            font:
             "sinko"
        }),
        color(WHITE),
        scale(6),
	    pos(GAME_WIDTH/2, GAME_HEIGHT/2-250),
        origin("center"),
        area(),
        z(99),
        fixed(),
    ])
    
    const cashtext = add([
        text("Nectar:"+cash, {
            font:
             "sinko"
        }),
        scale(4),
        color(255, 98, 0),
	    pos(5, GAME_HEIGHT-42),
        area(),
        z(99),
        fixed(),
    ])
    
    //updates
    BeeHive1.Honey = BeeHive1.DefaultHoney - 1
    
    spawnBee()
    
    loop(3, () => {
        if (BeeHive1.Honey==BeeHive1.MaxHoney) {
            HiveText.color = rgb(232, 255, 115)
        } else {
            HiveText.color = WHITE
            BeeHive1.Honey += 1
            HiveText.text = BeeHive1.Honey+" / "+BeeHive1.MaxHoney
            if (BeeHive1.Honey==BeeHive1.MaxHoney) {
                HiveText.color = rgb(232, 255, 115)
            }
        }
    
    })

    
    
    function click() {

        cash += BeeHive1.Honey
        HiveText.color = WHITE
        BeeHive1.Honey = 0
        HiveText.text = BeeHive1.Honey+" / "+BeeHive1.MaxHoney
        cashtext.text = "Nectar:"+cash
    
    }
})

scene("Menu", () => {
    const SplashText = add([
        text("Honey Farm Simulator", {
            font:
             "sinko"
        }),
        color(255, 132, 0),
        scale(6),
	    pos(GAME_WIDTH/2, GAME_HEIGHT/2-250),
        origin("center"),
        area(),
        fixed(),
    ])
    addButton("Start", vec2(GAME_WIDTH/2, GAME_HEIGHT/2), 48*1.6, 200*1.6, "sinko", () => go("Game"))
})

__init__()