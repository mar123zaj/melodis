import Phaser from 'phaser'
import MainScene from './scenes/MainScene'


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: window.innerHeight }
		}
	},
	scene: [MainScene]
})