import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { getReadingList } from '../../../../data-access/src/lib/+state/reading-list.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });
  tempBook: string;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    const addedBook = this._snackBar.open("Added", "Undo Action", {
      duration: 3000,
    });
    //const a: ReadingListItem = {};

    addedBook.onAction().subscribe(() => {

      this.store.select(getReadingList).pipe(take(1)).subscribe(books => {
        const item = books.find(item1 => item1.bookId === this.tempBook);

        if (item) {
          this.store.dispatch(removeFromReadingList({ item }));
        }

      });
      addedBook.dismiss();
    })
    this.tempBook = book.id;
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
