import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-multiple-tag-input',
  templateUrl: './multiple-tag-input.component.html',
  styleUrls: ['./multiple-tag-input.component.scss']
})
export class MultipleTagInputComponent {
  @Input() placeholder: String = '';
  @Input() items: String[] = [];
  @Output() add: EventEmitter<String> = new EventEmitter<String>();
  @Output() remove: EventEmitter<Number> = new EventEmitter<Number>();

  @ViewChild('newItem')
  newItemInput!: ElementRef<HTMLInputElement>;

  constructor() { }

  addItem(newItem: String) {
    if (!newItem) {
      return;
    }
    this.newItemInput.nativeElement.value = '';
    this.add.emit(newItem);
  }

  deleteItem(index: Number) {
    this.remove.emit(index);
  }
}
