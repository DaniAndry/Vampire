import { _decorator, Component, AudioSource, input, Input, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundClick')
export class PlaySoundOnFirstClick extends Component {
    @property(AudioSource)
    audioSource: AudioSource | null = null;

    private hasPlayedSound: boolean = false;

    onLoad() {
        // 1. Слушаем глобальные события мыши/тача для любого клика по экрану
        input.on(Input.EventType.MOUSE_DOWN, this.onFirstInput, this);
        input.on(Input.EventType.TOUCH_START, this.onFirstInput, this);

        // 2. Находим все кнопки на сцене и подписываемся на их событие 'click'
        const buttons = this.node.scene.getComponentsInChildren(Button);
        buttons.forEach(button => {
            button.node.on(Button.EventType.CLICK, this.onFirstInput, this); // Используем тот же обработчик
        });

        // Убедимся, что audioSource зациклен, если это требуется
        if (this.audioSource) {
            this.audioSource.loop = true;
        }
    }

    onDestroy() {
        // Отписываемся от глобальных событий
        input.off(Input.EventType.MOUSE_DOWN, this.onFirstInput, this);
        input.off(Input.EventType.TOUCH_START, this.onFirstInput, this);

        // Отписываемся от событий кнопок
        const buttons = this.node.scene.getComponentsInChildren(Button);
        buttons.forEach(button => {
            button.node.off(Button.EventType.CLICK, this.onFirstInput, this);
        });
    }

    private onFirstInput() {
        if (!this.hasPlayedSound && this.audioSource) {
            this.audioSource.play();
            this.hasPlayedSound = true;

            // Как только звук запущен, отписываемся от всех событий,
            // чтобы он не запускался повторно (т.к. он уже в лупе)
            input.off(Input.EventType.MOUSE_DOWN, this.onFirstInput, this);
            input.off(Input.EventType.TOUCH_START, this.onFirstInput, this);

            const buttons = this.node.scene.getComponentsInChildren(Button);
            buttons.forEach(button => {
                button.node.off(Button.EventType.CLICK, this.onFirstInput, this);
            });
        }
    }
}