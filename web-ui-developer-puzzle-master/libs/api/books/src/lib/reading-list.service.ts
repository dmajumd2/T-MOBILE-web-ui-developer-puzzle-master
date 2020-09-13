import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
     return list.map(item => {
        return {
          ...item,
          finished: false,
          finishedDate: ""
        }
      }).filter(x => x.bookId !== id);

    });
  }

  async updateBook(id): Promise<void> {
    this.storage.update(list => {
      const newlist = list.map(item => {
        if (id === item.bookId) {
          const dd = { ...item };
          dd.finished = true;
          dd.finishedDate = new Date().toISOString();
          return dd;
        } else {
          return item;
        }
      })
      return newlist;
    });
  }
}
