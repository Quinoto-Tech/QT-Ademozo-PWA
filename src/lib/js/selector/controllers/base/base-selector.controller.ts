export class BaseSelectorController {
    private selector: HTMLElement;
    private selectorButton: HTMLElement | null;
    private dropdown: HTMLElement | null;

    constructor(selector: HTMLElement) {
        this.selector = selector;
        this.selectorButton = this.selector.querySelector(`#${selector.id}_button`);
        this.dropdown = this.selector.querySelector(`#${selector.id}_dropdown`);

        this.init();
    }

    get isOpen() {
        return this.dropdown?.classList.contains("opacity-100");
    }

    private init() {
        this.selectorButton?.addEventListener("click", (e: MouseEvent) => {
            e.stopPropagation();
            this.toggleSelector();
        });

        document.addEventListener("click", (e: MouseEvent) => {
            if (!this.selector.contains(e.target as Node)) {
                this.closeSelector();
            }
        });
    }
    
    private openSelector() {
        this.dropdown?.classList.remove("scale-95", "opacity-0", "pointer-events-none");
        this.dropdown?.classList.add("scale-100", "opacity-100");
    }

    private closeSelector() {
        this.dropdown?.classList.remove("scale-100", "opacity-100");
        this.dropdown?.classList.add("scale-95", "opacity-0", "pointer-events-none");
    }

    private toggleSelector() {
        this.isOpen ? this.closeSelector() : this.openSelector();
    }

}
