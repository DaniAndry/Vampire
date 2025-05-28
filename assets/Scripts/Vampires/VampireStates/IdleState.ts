import { _decorator, Component, Node } from 'cc';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('IdleState')
export class IdleState extends State {
    private static readonly StateName: string = "Idle";

    start() {
        this.animator.play(IdleState.StateName);
    }
}
