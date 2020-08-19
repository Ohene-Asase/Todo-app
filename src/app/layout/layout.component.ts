import { Component, OnInit } from '@angular/core';
import { CrudService, TodoItem } from '../todo-list/crud.service'
import { NodeWithI18n } from '@angular/compiler';
import { VirtualTimeScheduler } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  todoForm: FormGroup;
  todoItmes: any;
  todos = [];

  constructor(private todoService: CrudService, private fb: FormBuilder) { }

  ngOnInit() {
    this.setupTodoForm();
    this.fetchList();
  }

  async saveTodo(todoItem: TodoItem) {
    try {
      if (!todoItem.todo) { return; }
      todoItem.createdAT = Date.now();
      console.log(todoItem);
      const res = await this.todoService.saveTodo(todoItem);
      if (res) { this.todoForm.reset(); }
    } catch(error) { } finally {}
  }

  async completeTodo(todoItem: TodoItem) {
    try {
      todoItem.isCompleted = true;
      const res = await this.todoService.saveTodo(todoItem);
    } catch(error) { } finally {}
  }

  toEdit(todo) {
    this.todoForm.patchValue(todo);
  }

  fetchList() {
    this.todoService.getTodos().onSnapshot((snapshot) => {
      let changes = snapshot.docs;
      this.todos = [];
      changes.forEach(change => {
        let todolist: any = change.data();
        todolist.id = change.id;
        this.todos.push(todolist)
      })
      this.todos.sort((a, b) => {
        return a.isCompleted - b.isCompleted
      })
    });
  }

  deleteList(listID) {
    this.todoService.deleteTodo(listID)
  }

  editList(value, list) {
    value['todo'] = list;
    console.log(list, value)
    this.todoService.editTask(value.id, value.todo)
  }

  completedTask(id, isCompleted) {
    this.todoService.alterList(id, !isCompleted)
  }

  async editTodo(todoItem: TodoItem) {
    try {
      const res = await this.todoService.editTodo(todoItem);
      console.log(res);
    } catch(error) { }
  }

  private setupTodoForm() {
    this.todoForm = this.fb.group({
      todo: ['', Validators.required],
      id: null,
      isCompleted: false,
      createdAT: null
    })
  }
}



