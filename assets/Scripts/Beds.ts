import { _decorator, Component, Node } from 'cc';
import { Bed } from './Bed';
import { Vampires } from './Vampires/Vampires';
import { Doctors } from './Doctors';

const { ccclass, property } = _decorator;

@ccclass('Beds')
export class Beds extends Component {
    @property([Bed])
    private beds: Bed[] = [];
    
    @property(Vampires)
    private vampires: Vampires = null;
    
    @property(Doctors)
    private doctors: Doctors = null;

    update() {
        let freeBeds = [];
        for (let i = 0; i < this.beds.length; i++) {
            if (this.beds[i] != null && this.beds[i].node.active) {
                if (!this.beds[i].isBusy) {
                    freeBeds.push(this.beds[i]);
                }
                else if (this.beds[i].needToHeal && this.beds[i].isBusy && this.beds[i].isReadyToHeal) {
                    this.doctors.goToHeal(this.beds[i]);
                }
            }
        }
        
        for (let i = 0; i < freeBeds.length; i++) {
            if (this.vampires.hasWaitingVampires()) {
                this.vampires.assignBedToFirstAvailable(freeBeds[i]);
            } else {
                break;
            }
        }
    }
}
