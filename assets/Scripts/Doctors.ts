import { _decorator, Component, Node } from 'cc';
import { Doctor } from './Doctor';
import { Bed } from './Bed';

const { ccclass, property } = _decorator;

@ccclass('Doctors')
export class Doctors extends Component {
@property({ type: [Doctor], visible: true }) 
private doctors: Doctor[] = [];

  start() {
        this.doctors = this.getComponentsInChildren(Doctor);
  }
  
    public goToHeal(bed: Bed) {
        for (const doctor of this.doctors) {
            if (doctor.node.active && !doctor.isBusy) {
                doctor.toHeal(bed);
            }
        }
    }
}