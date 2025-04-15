export class Animations {
    idleAnimationKey;
    idleAnimationSheetKey;
    idleAnimationFrameRate = 2;

    attackAnimationKey;
    attackAnimationSheetKey;
    attackAnimationFrameRate = 16;

    castAnimationKey;
    castAnimationSheetKey;
    castAnimationFrameRate = 10;

    idleAnimation;
    attackAnimation;
    castAnimation;

    constructor(unitName, idleAssetKey, attackAssetKey, castAssetKey) {
        this.idleAnimationKey = `${unitName} idle`;
        this.idleAnimationSheetKey = idleAssetKey;

        this.attackAnimationKey = `${unitName} attack`;
        this.attackAnimationSheetKey = attackAssetKey;

        this.castAnimationKey = `${unitName} cast`;
        this.castAnimationSheetKey = castAssetKey;
    }

    playIdleAnimation() {
        this.idleAnimation.play(this.idleAnimationKey);
    }

    playAttackAnimation() {
        if (this.attackAnimationSheetKey) {
            this.playAnimation(
                this.attackAnimation,
                this.attackAnimationKey,
                () => {
                    this.playAnimation(this.idleAnimation, this.idleAnimationKey);
                }
            );
        }
    }

    playCastAnimation(spell) {
        if (this.castAnimationSheetKey && spell.type === "Fire") {
            this.playAnimation(
                this.castAnimation,
                this.castAnimationKey,
                () => {
                    this.playAnimation(this.idleAnimation, this.idleAnimationKey);
                }
            );
        }
        if (this.castAnimationSheetKey && spell.type === "Conjuration") {
            this.playAnimation(
                this.castAnimation,
                this.castAnimationKey,
                () => {
                    this.playAnimation(this.idleAnimation, this.idleAnimationKey);
                }
            );
        }
    }
    
    playAnimation(sprite, key, onComplete) {
        this.idleAnimation.setVisible(false);
        this.attackAnimation.setVisible(false);
        this.castAnimation.setVisible(false);
    
        sprite.setVisible(true);
        sprite.play(key);
    
        if (onComplete) {
            sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, onComplete);
        }
    }    

    createAnimations(scene) {
        this.createIdleAnimation(scene);
        this.createAttackAnimation(scene);
        this.createCastAnimation(scene);
        this.idleAnimation = scene.add.sprite(480, 540, this.idleAnimationSheetKey).setScale(1.2);
        this.attackAnimation = scene.add.sprite(830, 348, this.attackAnimationSheetKey).setScale(1.2);
        this.castAnimation = scene.add.sprite(480, 540, this.castAnimationSheetKey).setScale(1.2);
        this.idleAnimation.setVisible(true);
        this.attackAnimation.setVisible(false);
        this.castAnimation.setVisible(false);
    }

    createIdleAnimation(scene) {
        scene.anims.create({
            key: this.idleAnimationKey,
            frames: scene.anims.generateFrameNumbers(this.idleAnimationSheetKey),
            frameRate: this.idleAnimationFrameRate,
            repeat: -1,
        });
    }

    createAttackAnimation(scene) {
        if (this.attackAnimationSheetKey) {
            scene.anims.create({
                key: this.attackAnimationKey,
                frames: scene.anims.generateFrameNumbers(this.attackAnimationSheetKey),
                frameRate: this.attackAnimationFrameRate,
                repeat: 0,
            });
        }
    }

    createCastAnimation(scene) {
        if (this.castAnimationSheetKey) {
            scene.anims.create({
                key: this.castAnimationKey,
                frames: scene.anims.generateFrameNumbers(this.castAnimationSheetKey),
                frameRate: this.castAnimationFrameRate,
                repeat: 0,
            });
        }
    }
}