import { Scene } from 'phaser';
import { Player } from '../objects/Player';

export class Game extends Scene
{
    keys: any
    player: Player
    platform: any
    movingPlatform: any

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('src/game/assets');
        
        this.load.image('background', 'default_background.png');
        this.load.image('platform', 'platform.png')

        this.load.spritesheet('player', 'Warrior_Idle.png', {
            frameWidth: 192,
            frameHeight: 192
        })
    }

    create ()
    {
        this.keys = this.input.keyboard?.createCursorKeys()

        this.physics.world.gravity.y = 150
        
        this.add.image(1024 / 2, 1024 / 2, 'background')

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3, 4, 5, 7]}),
            frameRate: 8,
            repeat: -1
        })

        this.player = new Player(this, 0, 900, 'player')


        this.player.body?.setSize(92, 72);

        this.platform = this.physics.add.staticGroup()

        this.platform.create(1024 / 2, 1024, 'platform').setScale(2.1).refreshBody();




        this.movingPlatform = this.physics.add.image(500, 700, 'platform');
        this.movingPlatform.setImmovable(true);
        this.movingPlatform.body.allowGravity = false;
        this.movingPlatform.setVelocityX(50);

        this.physics.add.collider(this.player, this.platform)
        this.physics.add.collider(this.player, this.movingPlatform)


    }

    update ()
    {
        //this.player.setVelocity(0)

        if (this.keys.left.isDown) {
            this.player.setVelocityX(-300)
        }
        else if (this.keys.right.isDown) {
            this.player.setVelocityX(300)
        }
        if (this.keys.up.isDown) {
            this.player.setVelocityY(-1000)
        }
        // else if (this.keys.down.isDown) {
        //     this.player.setVelocityY(300)
        // }


        if (this.movingPlatform.x >= 700)
        {
            this.movingPlatform.setVelocityX(-50);
        }
        else if (this.movingPlatform.x <= 400)
        {
            this.movingPlatform.setVelocityX(50);
        }
    }
}
