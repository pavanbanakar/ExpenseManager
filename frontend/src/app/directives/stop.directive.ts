import { Directive, Output, EventEmitter, Renderer2, ElementRef } from "@angular/core";

@Directive({
    selector:'[stopClick]'
})

export class StopClickDirective {

    @Output("click.stop") stopPropagation = new EventEmitter();

    unsubscribe;

    constructor(private renderer:Renderer2,private elementRef:ElementRef){

    }

    ngOnInit(): void {
 
        this.unsubscribe = this.renderer.listen(this.elementRef.nativeElement,"click",(event) => {
            event.stopPropagation();
            event.preventDefault();
            this.stopPropagation.emit(event);
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe();
    }
}