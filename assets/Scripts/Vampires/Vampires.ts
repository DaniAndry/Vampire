import { _decorator, Component, Node, Vec3, Prefab, instantiate, tween } from 'cc';
import { Vampire } from './Vampire';
import { Bed } from '../Bed';
import { MoneyController } from '../Money/MoneyController';

const { ccclass, property } = _decorator;

@ccclass('Vampires')
export class Vampires extends Component {
    @property private moveDuration: number = 0.01;    
    @property(Prefab) private vampirePrefab: Prefab = null;
    @property(Node) private vampireExitPoint: Node = null;
    @property(Node) private targetPoint: Node = null;
    @property(Node) private intermidiateExitPoint: Node = null;
    @property(Node) private firstIntermidiateExitPoint: Node = null;
    @property(Node) private temporarytPoint: Node = null;
    @property(MoneyController) private money: MoneyController = null;

    @property([Vampire]) private vampires: Vampire[] = [];
    private _waitingPositions: Vec3[] = [];
    
    @property
    private maxParallelAssignments: number = 2;
    
    private _currentAssignments: number = 0;
    
    @property
    private assignmentDelay: number = 0.1;

    start() {
        this.vampires = this.getComponentsInChildren(Vampire);
        
        this._waitingPositions = this.vampires.map(vampire => vampire.node.position.clone());
    }

    assignBedToFirstAvailable(bed: Bed) {
        if (!this.vampirePrefab) {
            console.error("[Vampires] Prefab вампира не назначен в инспекторе!");
            return;
        }
        if (this.vampires.length === 0) {
            return;
        }
        
        
        if (this._currentAssignments >= this.maxParallelAssignments) {
            return;
        }
        
        
        this._currentAssignments++;

        const departingVampire = this.vampires[0];
        const currentOccupiedLocalPositions = this.vampires.map(v => v.node.position.clone());

        const spawnLocalPosForNewcomer = currentOccupiedLocalPositions[currentOccupiedLocalPositions.length - 1].clone();

        
        departingVampire.toFirst(bed);
        departingVampire.initPoint(
            this.intermidiateExitPoint,
            this.vampireExitPoint,
            this.money,
            this.targetPoint,
            this.firstIntermidiateExitPoint,
            this.temporarytPoint
        );
        bed.takeABed();

        
        const newVampireNode = instantiate(this.vampirePrefab);
        this.node.addChild(newVampireNode);
        newVampireNode.position = spawnLocalPosForNewcomer;

        const newVampire = newVampireNode.getComponent(Vampire);
        if (!newVampire) {
            console.error("[Vampires] Не удалось получить компонент Vampire из префаба! Удаляю созданный узел.", newVampireNode.name);
            newVampireNode.destroy(); 
            return; 
        }
        newVampire.initPoint( 
            this.intermidiateExitPoint,
            this.vampireExitPoint,
            this.money,
            this.targetPoint,
            this.firstIntermidiateExitPoint,
            this.temporarytPoint
        );

        this.vampires.shift(); 
        this.vampires.push(newVampire);

        this._waitingPositions = [];
        for (let i = 0; i < this.vampires.length - 1; i++) {
            this._waitingPositions.push(currentOccupiedLocalPositions[i].clone());
        }
        
        this._waitingPositions.push(spawnLocalPosForNewcomer.clone()); 

        this.moveVampiresToNewTargets();
    }
    
    private moveVampiresToNewTargets() {
        const countToMove = this.vampires.length - 1;

        if (countToMove <= 0) {
            this._currentAssignments = Math.max(0, this._currentAssignments - 1);
            return;
        }

        
        let vampiresToMove = 0;
        for (let i = 0; i < countToMove; i++) {
            const vampireToMove = this.vampires[i];
            const targetLocalPos = this._waitingPositions[i];
            if (!vampireToMove.node.position.equals(targetLocalPos)) {
                vampiresToMove++;
            }
        }
        
        
        if (vampiresToMove === 0) {
            this._currentAssignments = Math.max(0, this._currentAssignments - 1);
            return;
        }
        
        let completedMoves = 0;
        
        for (let i = 0; i < countToMove; i++) {
            const vampireToMove = this.vampires[i];
            const targetLocalPos = this._waitingPositions[i]; 
            
            if (!vampireToMove.node.position.equals(targetLocalPos)) {
                tween(vampireToMove.node)
                    .to(this.moveDuration, { position: targetLocalPos })
                    .call(() => {
                        completedMoves++;
                        if (completedMoves >= vampiresToMove) {
                            // Все движения завершены, уменьшаем счетчик текущих назначений
                            this.scheduleOnce(() => {
                                this._currentAssignments = Math.max(0, this._currentAssignments - 1);
                            }, this.assignmentDelay);
                        }
                    })
                    .start();
            }
        }
    }

    getVampireCount(): number {
        return this.vampires.length;
    }
    
    hasWaitingVampires(): boolean {
        return this.vampires.length > 0;
    }
}