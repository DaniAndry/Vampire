import { _decorator, Component, Node, Sprite } from 'cc';
import { State } from '../../States/State';
import { Vampire } from '../Vampire';
import { Bed } from '../../Bed';
const { ccclass, property } = _decorator;

@ccclass('HealState')
export class HealState extends State {
    private _targetAngleZ: number = -70;
    private _spriteRenderer: Sprite = null;
    private _vampire: Vampire = null;

    start() {
        this._vampire = this.getComponent(Vampire);
        this._spriteRenderer = this.getComponent(Sprite);
        // Закомментируем воспроизведение анимации poof, так как спрайты не найдены
        // this.animator.play("poof");
        this._spriteRenderer.enabled = false;
        
        if (this.target) {
            this.target.healBed();
        }
    }
}
