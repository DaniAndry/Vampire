import { _decorator, Component, Node, EventTarget } from 'cc';
import { MoneyUI } from './MoneyUI';
const { ccclass, property } = _decorator;

@ccclass('MoneyController')
export class MoneyController extends Component {
    @property(MoneyUI)
    private moneyUI: MoneyUI = null;
    
    private _money: number = 30;
    
    // Создаем событие изменения денег
    private emitMoneyChanged() {
        this.node.emit('money-changed', this._money);
    }

    get currentMoney(): number {
        return this._money;
    }

    start() {
        this.moneyUI.updateText(this._money);
    }

    addMoney(money: number) {
        this._money += money;
        this.moneyUI.updateText(this._money);
        this.emitMoneyChanged();
    }

    tryToBuy(cost: number): boolean {
        return this._money >= cost;
    }

    removeMoney(cost: number) {
        this._money -= cost;
        this.moneyUI.updateText(this._money);
        this.emitMoneyChanged();
    }
}
