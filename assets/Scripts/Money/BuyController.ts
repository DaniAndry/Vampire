import { _decorator, Component, Node } from 'cc';
import { MoneyController } from './MoneyController';
import { BuyButton } from './BuyButton';
import super_html_playable  from '../../src/super_html/super_html_playable';

const { ccclass, property } = _decorator;

declare global {
    interface Window {
        super_html: any;
    }
}

@ccclass('BuyController')
export class BuyController extends Component {
    @property({ type: MoneyController, tooltip: 'Контроллер денег' })
    public money: MoneyController = null;

    @property({ type: BuyButton })
    public doctorButton: BuyButton = null;

    @property({ type: BuyButton })
    public bedButton: BuyButton = null;

    @property({ type: BuyButton })
    public doctorButtonLand: BuyButton = null;

    @property({ type: BuyButton })
    public bedButtonLand: BuyButton = null;

    @property({ type: [Node], tooltip: 'Массив докторов' })
    public doctors: Node[] = [];

    @property({ type: [Node], tooltip: 'Массив кроватей' })
    public beds: Node[] = [];

    private doctorIndex = 0;
    private bedIndex = 0;

    private readonly bedPrices = [10, 20, 40, 90];
    private readonly doctorPrices = [10, 30, 50, 120];

    private isTutorialActive = false;

    onLoad() {
        this.initializeButton(this.doctorButton, this.doctorPrices, () => this.buyDoctor());
        this.initializeButton(this.doctorButtonLand, this.doctorPrices, () => this.buyDoctor());
        this.initializeButton(this.bedButton, this.bedPrices, () => this.buyBed());
        this.initializeButton(this.bedButtonLand, this.bedPrices, () => this.buyBed());

        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.crazypandafzco.vampirekingdom&hl=en");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/vampire-legacy-city-builder/id6468058020");

        this.updateAllButtons();

        if (this.money) {
            this.money.node.on('money-changed', () => this.updateAllButtons(), this);
        }
    }

    onDestroy() {
        if (this.money) {
            this.money.node.off('money-changed', () => this.updateAllButtons(), this);
        }
    }

    private initializeButton(button: BuyButton, prices: number[], callback: Function): void {
        if (button) {
            button.initialize(prices, callback);
        }
    }

    private updateAllButtons() {
        if (!this.money) {
            return;
        }

        const currentMoney = this.money.currentMoney;
        [this.doctorButton, this.doctorButtonLand, this.bedButton, this.bedButtonLand].forEach(button => {
            button?.updateButtonState(currentMoney);
        });
    }

    private buyItem(isDoctor: boolean) {
        const mainButton = isDoctor ? this.doctorButton : this.bedButton;
        const landButton = isDoctor ? this.doctorButtonLand : this.bedButtonLand;
        const items = isDoctor ? this.doctors : this.beds;
        const index = isDoctor ? this.doctorIndex : this.bedIndex;

        if (this.doctorIndex == 2 || this.bedIndex == 2) {
           this.showAdd();
           return;
        }

        if (landButton?.isMaxLevel()) return;
        if (!items || index >= items.length) return;

        const cost = mainButton.getCurrentPrice();
        if (!this.money?.tryToBuy(cost)) return;

        this.money.removeMoney(cost);

        const item = items[index];
        if (item) {
            item.active = true;

            if (isDoctor) {
                this.doctorIndex++;
            } else {
                this.bedIndex++;
            }

            mainButton.increaseLevel();
            landButton.increaseLevel();
        }
        this.updateAllButtons();
    }

    private buyDoctor() {
        this.buyItem(true);
    }

    private buyBed() {
        this.buyItem(false);
    }

    private showAdd() {
         super_html_playable.download();
    }

    public completeTutorial() {
        this.isTutorialActive = false;
    }
}