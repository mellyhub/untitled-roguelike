export class Animations {
    idleAnimationKey;
    idleAnimationSheetKey;

    attackAnimationKey;
    attackAnimationSheetKey;

    castAnimationKey;
    castAnimationSheetKey;

    properties;

    idleAnimation;
    attackAnimation;
    castAnimation;

    constructor(unitName, idleAssetKey, attackAssetKey, castAssetKey, properties) {
        this.unitName = unitName;
        this.idleAnimationKey = `${unitName} idle`;
        this.idleAnimationSheetKey = idleAssetKey;

        this.attackAnimationKey = `${unitName} attack`;
        this.attackAnimationSheetKey = attackAssetKey;

        this.castAnimationKey = `${unitName} cast`;
        this.castAnimationSheetKey = castAssetKey;

        this.properties = properties;
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
        this.idleAnimation = scene.add.sprite(this.properties.idleAnimPos.x, this.properties.idleAnimPos.y, this.idleAnimationSheetKey).setScale(1.2);
        this.attackAnimation = scene.add.sprite(this.properties.attackAnimPos.x, this.properties.attackAnimPos.y, this.attackAnimationSheetKey).setScale(1.2);
        this.castAnimation = scene.add.sprite(this.properties.castAnimPos.x, this.properties.castAnimPos.y, this.castAnimationSheetKey).setScale(1.2);
        this.idleAnimation.setVisible(true);
        this.attackAnimation.setVisible(false);
        this.castAnimation.setVisible(false);
    }

    createIdleAnimation(scene) {
        scene.anims.create({
            key: this.idleAnimationKey,
            frames: scene.anims.generateFrameNumbers(this.idleAnimationSheetKey),
            frameRate: this.properties.idleAnimFramerate,
            repeat: -1,
        });
    }

    createAttackAnimation(scene) {
        if (this.attackAnimationSheetKey) {
            scene.anims.create({
                key: this.attackAnimationKey,
                frames: scene.anims.generateFrameNumbers(this.attackAnimationSheetKey),
                frameRate: this.properties.attackAnimFramerate,
                repeat: 0,
            });
        }
    }

    createCastAnimation(scene) {
        if (this.castAnimationSheetKey) {
            scene.anims.create({
                key: this.castAnimationKey,
                frames: scene.anims.generateFrameNumbers(this.castAnimationSheetKey),
                frameRate: this.properties.castAnimFramerate,
                repeat: 0,
            });
        }
    }
}