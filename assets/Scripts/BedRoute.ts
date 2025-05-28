import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BedRoute')
export class BedRoute extends Component {
    @property([Node])
    doctorWaypoints: Node[] = [];
    
    @property([Node])
    vampireWaypoints: Node[] = [];
    
    // Геттеры для обеспечения совместимости с исходным C# кодом
    get DoctorWaypoints(): Node[] {
        return this.doctorWaypoints;
    }
    
    get VampireWaypoints(): Node[] {
        return this.vampireWaypoints;
    }
}
