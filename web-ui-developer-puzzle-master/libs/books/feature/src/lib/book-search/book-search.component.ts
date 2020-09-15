import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';


import { Subject } from "rxjs";

import { Observable } from "rxjs";

import { debounceTime, distinctUntilChanged, mergeMap, take } from 'rxjs/operators';

import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getReadingList,
  removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  unsubscribeBookSearch: Subscription;
  subscription: any;
  tempBook: string;

  searchForm = this.fb.group({
    term: ''
  });

  searchTextChanged = new Subject<string>();

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    // this.unsubscribeBookSearch = this.store.select(getAllBooks).subscribe(books => {
    //   this.books = books;
    this.store.select(getReadingList).subscribe(readingList => {
      this.store.select(getAllBooks).subscribe(books => {

        const readIngObject = {};
        readingList.forEach(item => {
          readIngObject[item.bookId] = {
            finished: item.finished,
          }
        })

        if (readIngObject && books.length) {
          const newBooks = books.map(book => {
            if (readIngObject[book.id]) {
              return {
                ...book,
                finished: readIngObject[book.id].finished
              }
            } else {
              return book
            }
          })
          this.books = newBooks;
        } else {
          this.books = books;
        }
      })

    });

    this.subscription = this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res) => {
      this.searchForm.controls.term.setValue(res);
      this.searchBooks()
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  search($event: { target: { value: string; }; }) {
    this.searchTextChanged.next($event.target.value);
  }

  addBookToReadingList(book: Book) {
    const addedBook = this._snackBar.open("Added", "Undo Action", {
      duration: 3000,
    });

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

  ngOnDestroy(): void {
    this.unsubscribeBookSearch.unsubscribe();
    this.subscription.unsubscribe();
  }
}
