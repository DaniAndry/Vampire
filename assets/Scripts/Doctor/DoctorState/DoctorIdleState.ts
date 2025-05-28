import { _decorator, Component, Node, Animation } from 'cc';
import { State } from '../../States/State';
import { Bed } from '../../Bed';
import { Transition } from '../../Transition/Transition';
const { ccclass, property } = _decorator;

@ccclass('DoctorIdleState')
export class DoctorIdleState extends State {

    onLoad() {
        // Инициализация состояния
    }

    onEnable() {
        if (this.animator) {
           this.animator.play("Idle");
        }
    }
    
    enter(animator: Animation, target: Bed) {
        super.enter(animator, target);
        for (const transition of this.transitions) {
            if (transition) {
                transition.enabled = true;
                if (target) {
                    transition.init(target);
                }
            }
        }
    }
}
