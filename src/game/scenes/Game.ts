import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Gold } from '../objects/Gold';

export class Game extends Scene
{
    keys: any
    player: Player
	enemy: Enemy
    golds: Gold[] = []

    constructor ()
    {
        super('Game');
    }

    createPlatform(x: number, y: number, length: number, start: number, middle: number, end: number): Phaser.Physics.Arcade.StaticGroup
    {
        const tileSize = 32;
        const groundPlatform = this.physics.add.staticGroup();

        groundPlatform.create(x, y, 'ground', start);

        for (let i = 1; i < length - 1; i++)
        {
            groundPlatform.create(x + i * tileSize, y, 'ground', middle);
        }

        groundPlatform.create(x + (length - 1) * tileSize, y, 'ground', end);

        return groundPlatform;
    }

    createFloatingPlatform(x: number, y: number, length: number)
    {
        const groundPlatformUpper = this.createPlatform(x, y, length, 108, 109, 113)
        const groundPlatformBottom = this.createPlatform(x, y + 32, length, 108 + 18, 109 + 18, 113 + 18)
        
        this.physics.add.collider(this.player, groundPlatformUpper)
        this.physics.add.collider(this.player, groundPlatformBottom)
    }

    preload ()
    {
        this.load.setPath('src/game/assets');
        this.load.image('background', 'default_background.png');

        Player.preload(this)
        Gold.preload(this)
        Enemy.preload(this)

        this.load.spritesheet('ground', 'Tilemap_color1.png', {
            frameHeight: 32,
            frameWidth: 32,
        })
    }

    create ()
    {
        this.keys = this.input.keyboard?.createCursorKeys()
        this.physics.world.gravity.y = 75
        this.physics.world.setBounds(0, 0, 3072, 1024)
        for (let x = 0; x < 3; x++) {
            this.add.image(512 * (x + (x + 1)) , 1024 / 2, 'background')
        }

        const groundPlatform = this.createPlatform(14, 1010, 32 * 3, 0, 1, 5)

        const floatingPlatformUpper = this.createPlatform(564, 450, 8, 108, 109, 113)
        const floatingPlatformBottom = this.createPlatform(564, 450 + 32, 8, 126, 127, 131)

        Player.createAnims(this)
        Gold.createAnims(this)
        Enemy.createAnims(this)
        this.player = new Player(this, 0, 900, 'player_idle')
		this.enemy = new Enemy(this, 900, 900, 'enemy')

        this.golds.push(new Gold(this, 512, 900, 'gold'))
        this.golds.push(new Gold(this, 712, 900, 'gold'))
        this.golds[0].body?.setSize(55, 35)

        this.physics.add.collider(this.player, groundPlatform)
        this.physics.add.collider(this.enemy, groundPlatform)

        this.physics.add.collider(this.golds[0], groundPlatform)
        this.physics.add.collider(this.golds[1], groundPlatform)
        
        this.physics.add.collider(this.player, floatingPlatformUpper)
        this.physics.add.collider(this.player, floatingPlatformBottom)
        
		// Ensure Player.hitEnemy runs with `this` bound to the Player instance.
		this.physics.add.overlap(this.player.attackHitbox, this.enemy, this.player.hitEnemy, undefined, this.player)

        this.createFloatingPlatform(256, 705, 16)
        this.createFloatingPlatform(564, 450, 8)
        this.createFloatingPlatform(1024, 636, 20)
        this.createFloatingPlatform(2048, 700, 10)
        this.createFloatingPlatform(1712, 400, 10)
        this.createFloatingPlatform(150, 200, 9)
        
        this.physics.add.overlap(this.player, this.golds[0], Gold.collect, undefined, this) 
        this.physics.add.overlap(this.player, this.golds[1], Gold.collect, undefined, this)
        // Ensure Player.takeHit runs with `this` bound to the Player instance.
        this.physics.add.overlap(this.enemy, this.player, this.player.takeHit, undefined, this.player)

        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, 3072, 1024)
    }

    update ()
    {
    }
}
