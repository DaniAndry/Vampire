import { _decorator, Component, Node, Button, Sprite, Animation, SpriteFrame, UITransform, Vec3, Size } from 'cc';
import { BuyController } from './Money/BuyController';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property({ type: Button }) public medicButton: Button = null;
    @property({ type: Button }) public bedButton: Button = null;
    @property({ type: Button }) public medicButtonLand: Button = null;
    @property({ type: Button }) public bedButtonLand: Button = null;

    @property({ type: Node }) public doctorPrice: Node = null;
    @property({ type: Node }) public bedPrice: Node = null;
    @property({ type: Node }) public doctorPriceLand: Node = null;
    @property({ type: Node }) public bedPriceLand: Node = null;

    @property({ type: Node }) public bedHand: Node = null;
    @property({ type: Node }) public doctorHand: Node = null;
    @property({ type: Node }) public bedHandLand: Node = null;
    @property({ type: Node }) public doctorHandLand: Node = null;

    @property({ type: BuyController }) public buyController: BuyController = null;

    @property({ type: SpriteFrame }) public medicButtonLockImage: SpriteFrame = null;
    @property({ type: SpriteFrame }) public medicButtonImage: SpriteFrame = null;
    @property({ type: SpriteFrame }) public bedButtonLockImage: SpriteFrame = null;
    @property({ type: SpriteFrame }) public bedButtonImage: SpriteFrame = null;

    @property({ type: Animation }) private animator: Animation = null;

    private finalScale = new Vec3(0.194, 0.194, 0.194);
    private finalSize = new Size(980, 1447);

    start() {
        this.bedButton.node.on('click', this.onBedClicked, this);
        this.medicButton.node.on('click', this.onMedicClicked, this);
        this.bedButtonLand.node.on('click', this.onBedClicked, this);
        this.medicButtonLand.node.on('click', this.onMedicClicked, this);

        this.doctorPrice.active = false;
        this.doctorPriceLand.active = false;
        this.bedHand.active = true;
        this.bedHandLand.active = true;

        if (this.doctorHand) this.doctorHand.active = false;
        if (this.doctorHandLand) this.doctorHandLand.active = false;

        if (this.animator) this.animator.play("TutorialBed");

        this.medicButton.interactable = false;
        this.medicButtonLand.interactable = false;

        this.medicButton.getComponent(Sprite).spriteFrame = this.medicButtonLockImage;
        this.medicButtonLand.getComponent(Sprite).spriteFrame = this.medicButtonLockImage;
    }

    private onBedClicked() {
        this.doctorPrice.active = true;
        this.doctorPriceLand.active = true;
        this.bedPrice.active = false;
        this.bedPriceLand.active = false;

        this.medicButton.interactable = true;
        this.medicButtonLand.interactable = true;

        this.medicButton.getComponent(Sprite).spriteFrame = this.medicButtonImage;
        this.medicButtonLand.getComponent(Sprite).spriteFrame = this.medicButtonImage;
        this.bedButton.getComponent(Sprite).spriteFrame = this.bedButtonLockImage;
        this.bedButtonLand.getComponent(Sprite).spriteFrame = this.bedButtonLockImage;

        // Сбрасываем размеры кнопок после каждого нажатия
        this.resetButtonSizes();
        
        this.bedEnable();
    }

    private onMedicClicked() {
        // Сбрасываем размеры кнопок после каждого нажатия
        this.resetButtonSizes();
        
        this.medicEnable();

        this.bedButton.getComponent(Sprite).spriteFrame = this.bedButtonImage;
        this.bedButtonLand.getComponent(Sprite).spriteFrame = this.bedButtonImage;
        this.bedButton.interactable = true;
        this.bedButtonLand.interactable = true;
        this.bedPrice.active = true;
        this.bedPriceLand.active = true;
    }

    private bedEnable() {
        this.bedHand?.destroy();
        this.bedHandLand?.destroy();
        this.scheduleOnce(this.ofButton, 0.15);

        this.medicButton.interactable = true;
        this.medicButtonLand.interactable = true;

        if (this.animator) this.animator.play("TutorialDoctor");

        this.doctorHand.active = true;
        this.doctorHandLand.active = true;
    }

    private medicEnable() {
        this.completeTutorial();

        this.bedButton.interactable = true;
        this.bedButtonLand.interactable = true;

        if (this.animator) {
            this.animator.stop(); // Добавлено, чтобы гарантировать остановку анимации
            this.animator.enabled = false;
        }

        this.doctorHand?.destroy();
        this.doctorHandLand?.destroy();
    }

    private ofButton() {
        this.bedButton.interactable = false;
        this.bedButtonLand.interactable = false;
    }

    private completeTutorial() {
        this.bedButton.node.off('click', this.onBedClicked, this);
        this.medicButton.node.off('click', this.onMedicClicked, this);
        this.bedButtonLand.node.off('click', this.onBedClicked, this);
        this.medicButtonLand.node.off('click', this.onMedicClicked, this);

        this.setFinalSizes();
        
        // Дополнительно исправляем проблемную кнопку доктора
        this.fixDoctorButton();
        // И еще раз через небольшую задержку
        this.scheduleOnce(this.fixDoctorButton, 0.1);

        if (this.buyController) {
            this.buyController.completeTutorial();
        }
    }

    private setFinalSizes() {
        const buttons = [this.bedButton, this.medicButton, this.bedButtonLand, this.medicButtonLand];
        for (const button of buttons) {
            button.node.setScale(this.finalScale);
            const uiTransform = button.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(this.finalSize);
            }
        }
    }

    // Новый метод для сброса размеров кнопок в любой момент
    private resetButtonSizes() {
        // Временно останавливаем анимацию, чтобы она не конфликтовала с нашими размерами
        const wasEnabled = this.animator ? this.animator.enabled : false;
        if (this.animator && this.animator.enabled) {
            this.animator.enabled = false;
        }
        
        // Устанавливаем одинаковый размер для всех кнопок
        this.setFinalSizes();
        
        // Особое внимание проблемной кнопке доктора (принудительно устанавливаем размер дважды)
        this.fixDoctorButton();
        
        // Восстанавливаем анимацию, если она была активна
        if (this.animator && wasEnabled) {
            this.animator.enabled = wasEnabled;
        }
        
        // Запланируем повторную проверку размеров через короткий промежуток времени
        this.scheduleOnce(this.fixDoctorButton, 0.1);
    }
    
    // Метод для особой обработки кнопки доктора
    private fixDoctorButton() {
        // Особый фокус на medicButton - кнопке доктора
        if (this.medicButton) {
            // Принудительно устанавливаем точный размер и масштаб
            this.medicButton.node.setScale(this.finalScale);
            const uiTransform = this.medicButton.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(this.finalSize);
            }
            
            // Блокируем любые анимации для этой кнопки
            const buttonAnimator = this.medicButton.node.getComponent(Animation);
            if (buttonAnimator) {
                buttonAnimator.enabled = false;
            }
        }
    }
}