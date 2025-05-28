// Интерфейс для Bed, чтобы разорвать циклическую зависимость
export interface IBed {
    isBusy: boolean;
    needToHeal: boolean;
    onPlace: boolean;
    isReadyToHeal: boolean;
    isRun: boolean;
    isOccuped: boolean;
    
    takeABed(): void;
    occupedBed(): void;
    emptyBed(): void;
    healBed(): void;
    healComplete(): void;
    doctorOnPlace(): void;
    doctorOnRun(): void;
    onReady(): void;
    ofReady(): void;
}
