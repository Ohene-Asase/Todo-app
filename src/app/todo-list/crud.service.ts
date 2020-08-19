import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  readonly db_todo = 'Todo-2'


  constructor(private afs: AngularFirestore) { }


  createTodo(todoItem: TodoItem) {
    return this.afs.collection(this.db_todo).add(todoItem);
  }

  deleteTodo(id: any) {
    return this.afs.collection(this.db_todo).doc(id).delete()

  }

  getTodos() {
    return this.afs.collection(this.db_todo).ref.orderBy('createdAT', 'desc');
  }

  editTask(userKey, todo) {
    return this.afs.doc('Todo-2/' + userKey).update({ todo })
    // return this.afs.collection(this.db_todo).doc(todo.id).update({todo});
  }
  alterList(ListID, flag: boolean) {
    return this.afs.doc('Todo-2/' + ListID).update({ isCompleted: flag })
  }

  editTodo(todoItem: TodoItem) {
    return this.afs.collection(this.db_todo).doc(todoItem.id).update({ todoItem });
  }

  saveTodo(todoItem: TodoItem) {
    if (todoItem.id === null) {
      return this.afs.collection(this.db_todo).add({
        todo: todoItem.todo,
        createdAT: todoItem.createdAT,
        isCompleted: todoItem.isCompleted
      });
    } else {
      return this.afs.collection(this.db_todo).doc(todoItem.id).update({
        todo: todoItem.todo,
        isCompleted: todoItem.isCompleted
      });
    }
  }

}

export interface TodoItem {
  isCompleted: boolean,
  createdAT: number,
  todo: string,
  id?: string
}