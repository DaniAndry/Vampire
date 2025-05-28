import { _decorator, Component, Node } from 'cc';
import { State } from '../../States/State';
import { Vampire } from '../Vampire';
import { SpriteFillAnimator } from '../../SpriteFillAnimator';
const { ccclass, property } = _decorator;

@ccclass('HealCompleteState')
export class HealCompleteState extends State {
    private _vampire: Vampire = null;
    private spriteFillAnimator: SpriteFillAnimator = null;

    onEnable() {
        this.spriteFillAnimator = this.getComponentInChildren(SpriteFillAnimator);
        this.spriteFillAnimator.node.active = false;
        this._vampire = this.getComponent(Vampire);
        this.heal();

    }

    private heal() {
        this.target.ofReady();
        this.target.emptyBed();
    }
}
