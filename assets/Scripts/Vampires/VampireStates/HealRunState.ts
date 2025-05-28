import { _decorator, Component, Node } from 'cc';
import { State } from '../../States/State';
import { Vampire } from '../Vampire';
import { SpriteFillAnimator } from '../../SpriteFillAnimator';
const { ccclass, property } = _decorator;

@ccclass('HealRunState')
export class HealRunState extends State {
    @property(SpriteFillAnimator)
    private spriteFillAnimator: SpriteFillAnimator = null;
    
    private _vampire: Vampire = null;

    onEnable() {
        this.spriteFillAnimator = this.getComponentInChildren(SpriteFillAnimator);
        this.spriteFillAnimator.node.active = true;
        this._vampire = this.getComponent(Vampire);
        this.scheduleOnce(this.rotate, 1);
        this.spriteFillAnimator.switchFill();
    }

    private rotate() {
        this._vampire.startToHeal();
    }
}
