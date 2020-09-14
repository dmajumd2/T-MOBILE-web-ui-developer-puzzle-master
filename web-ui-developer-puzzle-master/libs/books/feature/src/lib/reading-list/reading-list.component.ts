import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnDestroy {
  readingList$: Observable<any> = this.store.select(getReadingList);

  constructor(private readonly store: Store) {}

  removeFromReadingList(item: any) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  public ngOnDestroy(): void {
  }
}
