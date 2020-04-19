class SceneGameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data){
        this.score = data.score;
    }

    preload(){
        this.load.image('exit', 'assets/exitbutton.png');
    }

 
    create(){

        this.gameover = this.add.tileSprite(0, 0, config.width, config.height, 'gameover');
        this.gameover.setOrigin(0, 0);

        this.scoreLabel = this.add.bitmapText(game.config.width/2 - 125, game.config.height*.30, 'pixelFont', 'SCORE', 40);
        this.scoreLabel.text = "YOUR SCORE " + zeroPad(this.score, 6);
       
        var try_again_button = this.add.image(config.width/2, config.height/2,'try_again_button').setInteractive();
        try_again_button.setScale(1.5);
        try_again_button.on('pointerup', ()=>{
            this.scene.start('bootGame');
        });

        var handwash = this.add.image(config.width/2, config.height * .75,'handwash');
        handwash.setScale(.2);

        this.message = this.add.bitmapText(game.config.width/2 - 155, game.config.height*.95, 'pixelFont', 'SCORE', 16);
        this.message.text = "Remember to wash hands often for at least 20 seconds!";

        
    }

    update(){

    }
}