export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(1.5)
        this.setCollideWorldBounds(true)
        
        this.setGravityY(5000)
        this.setDamping(true)
        this.setDrag(0.01)


    }
}