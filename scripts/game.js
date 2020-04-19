


var config = {
    type: Phaser.AUTO,
    width:600,
    height: 400,
    backgroundColor: 0x000000,
    scene: [Scene0,Scene1,SceneGameOver],
    physics:{
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 400
    },
    pixelArt: false
}

var gameSettings = {
    playerSpeed: 150,
}

var game = new this.Phaser.Game(config);

function zeroPad(number, size) {
    var stringNumber = String(number);
    if (!number) { stringNumber = "0" };
    while (stringNumber.length < (size || 2)) {
        stringNumber = "0" + stringNumber;
    }
    return stringNumber;
}
