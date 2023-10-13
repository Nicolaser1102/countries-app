import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy {


private debouncer: Subject<string> = new Subject<string>();
private debouncerSubscription?: Subscription;

@Input()
public placeholder:string =  'Soy un placeholder desde share!!';

@Input()
public initialValue:string = '';


@ViewChild('txtSearchInput')
  public tagInput!:ElementRef<HTMLInputElement>;


@Output()
public onSearch: EventEmitter<string> = new EventEmitter();

@Output()
public onDebounce:EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(400)
    )
    .subscribe(value => {
      this.onDebounce.emit(value);
    })
  }
  //Metodo que se va a mandar a llamar cuando la instancia del componente es destruido
  ngOnDestroy(): void {
    // this.debouncer.unsubscribe();
    this.debouncerSubscription?.unsubscribe();

  }

  emitSearchValue():void{
    const newSearch = this.tagInput.nativeElement.value;
    this.tagInput.nativeElement.value = '';

    this.onSearch.emit(newSearch);
  }

  onKeyPress(searchTerm: string):void{
    this.debouncer.next(searchTerm);
  }


}
