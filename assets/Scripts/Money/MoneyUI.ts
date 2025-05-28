import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoneyUI')
export class MoneyUI extends Component {
    private _moneyText: Label = null;

    onLoad() {
        this._moneyText = this.getComponent(Label);
    }
    
    updateText(money: number) {
        if (this._moneyText) {
            this._moneyText.string = money.toString();
        } else {
            console.warn('MoneyUI: _moneyText is null, cannot update text');
        }
    }
}
