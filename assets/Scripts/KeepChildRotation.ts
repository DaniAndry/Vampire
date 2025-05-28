import { _decorator, Component, Node, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KeepChildRotation')
export class KeepChildRotation extends Component {
    @property(Node)
    childObject: Node = null;

    update() {
        if (this.childObject != null) {
            this.childObject.setRotation(Quat.IDENTITY);
        }
    }
}
