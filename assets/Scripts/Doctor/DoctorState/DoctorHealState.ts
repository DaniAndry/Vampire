import { _decorator, Component, Node, Sprite } from 'cc';
import { State } from '../../States/State';
const { ccclass, property } = _decorator;

@ccclass('DoctorHealState')
export class DoctorHealState extends State {
    private static readonly StateName: string = "Idle";
    private _renderer: Sprite = null;

  onEnable() {
        this._renderer = this.getComponent(Sprite);
        this.animator.play("Idle");
          if (this.target && this.target.isBusy) {
            this.target.doctorOnPlace();
            const currentScale = this.node.scale;

            this.node.setScale(Math.abs(currentScale.x), currentScale.y, currentScale.z);
        }
    }

    update() {
      
    }
}
