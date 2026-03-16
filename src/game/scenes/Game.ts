import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Gold } from '../objects/Gold';

export class Game extends Scene
{
    keys: any
    player: Player
    gold_a: any
    gold_b: any
    golds: Gold[] = []
    isAttacking: boolean = false

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
        this.load.spritesheet('player_idle', 'Warrior_Idle.png', {
            frameWidth: 192,
            frameHeight: 192
        })
        this.load.spritesheet('player_run', 'Warrior_Run.png', {
            frameWidth: 192,
            frameHeight: 192
        })
        this.load.spritesheet('ground', 'Tilemap_color1.png', {
            frameHeight: 32,
            frameWidth: 32,
        })
        this.load.spritesheet('gold', 'Gold Stone 3_Highlight.png', {
           frameHeight: 128,
           frameWidth: 128
        })
        this.load.spritesheet('player_attack', 'Warrior_Attack1.png', {
           frameHeight: 192,
           frameWidth: 192
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
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player_idle', { frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player_attack', { frames: [0, 1, 2, 3]}),
            frameRate: 8,
            repeat: 0
        })
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_run', { frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'gold_shine',
            frames: this.anims.generateFrameNumbers('gold', {frames: [0, 1, 2, 3, 4, 5]}),
            frameRate: 8,
            repeat: 2
        })

        const groundPlatform = this.createPlatform(14, 1010, 32 * 3, 0, 1, 5)

        const floatingPlatformUpper = this.createPlatform(564, 450, 8, 108, 109, 113)
        const floatingPlatformBottom = this.createPlatform(564, 450 + 32, 8, 126, 127, 131)

        this.player = new Player(this, 0, 900, 'player_idle')

        this.golds.push(new Gold(this, 512, 900, 'gold'))
        this.golds.push(new Gold(this, 712, 900, 'gold'))

        this.player.body?.setSize(84, 70)
        this.golds[0].body?.setSize(55, 35)
        this.physics.add.collider(this.player, groundPlatform)

        this.physics.add.collider(this.golds[0], groundPlatform)
        this.physics.add.collider(this.golds[1], groundPlatform)
        
        this.physics.add.collider(this.player, floatingPlatformUpper)
        this.physics.add.collider(this.player, floatingPlatformBottom)

        this.createFloatingPlatform(256, 705, 16)
        this.createFloatingPlatform(564, 450, 8)
        this.createFloatingPlatform(1024, 636, 20)
        this.createFloatingPlatform(2048, 700, 10)
        this.createFloatingPlatform(1712, 400, 10)
        this.createFloatingPlatform(150, 200, 9)
        
        this.keys = this.input.keyboard?.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            J: Phaser.Input.Keyboard.KeyCodes.J
        })
        
        this.physics.add.overlap(this.player, this.golds[0], this.collectGold, undefined, this) 
        this.physics.add.overlap(this.player, this.golds[1], this.collectGold, undefined, this) 

        this.cameras.main.startFollow(this.player, true)
        this.cameras.main.setBounds(0, 0, 3072, 1024)

        this.player.on('animationcomplete-attack', () => {
            this.isAttacking = false;
        });


    }

    update ()
    {
        if (this.keys.J.isDown && !this.isAttacking) {
            this.isAttacking = true;
            this.player.play('attack');
        }

        if (!this.isAttacking)
        {
            if (this.keys.left.isDown || this.keys.A.isDown) {
                this.player.setFlipX(true)
                this.player.play('run', true)
                this.player.setVelocityX(-300)
            }
            else if (this.keys.right.isDown || this.keys.D.isDown) {
                this.player.setFlipX(false)
                this.player.play('run', true)
                this.player.setVelocityX(300)
            }
            else {
                this.player.play('idle', true)
            }

        }


        if ((this.keys.up.isDown || this.keys.W.isDown) && this.player.body?.touching.down) {
            this.player.setVelocityY(-3000)
        }
    }

    collectGold(_player: any, _gold: any)
    {
       _gold.disableBody(true, true)
    }
}
