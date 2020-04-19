class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene){

        var x = scene.player.x + 16;
        var y = scene.player.y;
        super(scene,x,y,'beam'); 

        scene.projectiles.add(this);

         // 3.2 add to scene
        scene.add.existing(this);

        this.play('beam_anim');
        scene.physics.world.enableBody(this);
        this.body.velocity.x = 250;
    }

    update(){
        if(this.x > config.width - 20){
            this.destroy();
        }
    }
}