export class Snowman {
    name = "Snowman";
    health = 200;
    strength = 30;
    energy = 100;
    weapon = weapons.dagger;
    spells = [];

    attack(target) {
        target.health -= 50;
    }
}