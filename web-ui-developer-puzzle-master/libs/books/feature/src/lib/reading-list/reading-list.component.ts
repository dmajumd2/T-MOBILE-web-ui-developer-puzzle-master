import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getReadingList, removeFromReadingList, addToReadingList, getAllBooks } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);
  tempBook: string;

  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    const removeBook = this._snackBar.open("Remove", "Undo Action", {
      duration: 3000,
    });
    removeBook.onAction().subscribe(() => {
      this.store.select(getAllBooks).pipe(take(1)).subscribe(books => {
        const book = books.find(item1 => item1.id === this.tempBook);
        if (item) {
          this.store.dispatch(addToReadingList({ book }));
        }
      });
      removeBook.dismiss();
    })

    this.tempBook = item.id;
    this.store.dispatch(removeFromReadingList({ item }));
  }
  
}
