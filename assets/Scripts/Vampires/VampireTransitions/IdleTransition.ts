import { _decorator, Component, Node, find } from 'cc';
import { Transition } from '../../Transition/Transition';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('IdleTransition')
export class IdleTransition extends Transition {

    @property({type: State, visible: true, displayName: 'Целевое состояние', override: true})
    public targetState: State = null;
    @property
    public transitionDelay: number = 1.0;
    
    private timer: number = 0;
    
    start() {
        this.timer = 0;
        
        if (!this.targetState && this.node) {

            const states = this.node.getComponents("State") as State[];

            for (const state of states) {
                if (state.name?.includes('Move') || state.constructor?.name?.includes('Move')) {
                    this.setTargetState(state);
                    break;
                }
            }
        }
    }
    
    update(dt: number) {
        if (this.enabled && !this.needTransit) {
            this.timer += dt;
            
            if (this.timer >= this.transitionDelay) {
                this.needTransit = true;
            }
        }
    }
    
    public enable(): void {
        this.timer = 0;
        this.needTransit = false;
    }
}
