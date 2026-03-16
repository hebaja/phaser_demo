export class Gold extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setCollideWorldBounds(true)
        this.setGravityY(5000)
        
        this.body?.setSize(55, 35)
        
        scene.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                this.play('gold_shine');
            }
        });

    }

}