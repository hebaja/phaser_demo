import { Scene } from 'phaser';
import { Player } from '../objects/Player';

export class Game extends Scene
{
    keys: any
    player: Player

    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('src/game/assets');
        
        this.load.image('background', 'default_background.png');
        this.load.image('character', 'character_redux.png');
        this.load.image('police', 'police.png')
        this.load.image('tux', 'tux_pixel.png')
    }

    create ()
    {
        this.keys = this.input.keyboard?.createCursorKeys()

        this.physics.world.gravity.y = 150
        
        this.add.image(1024 / 2, 1024 / 2, 'background')

        this.player = new Player(this, 0, 1024, 'character')
        
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
    }
}
