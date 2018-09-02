import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
let stream$ = Observable.create((observe) => {
    observe.next(1)
    observe.next(2)
    observe.next(3)
    observe.next(4)
    observe.complete()
})

stream$.subscribe( (value) => {
   console.log('Value',value);
},() => {},() => {console.log('wancheng')})


 