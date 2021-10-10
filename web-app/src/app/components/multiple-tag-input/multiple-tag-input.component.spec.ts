import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTagInputComponent } from './multiple-tag-input.component';

describe('MultipleTagInputComponent', () => {
  let component: MultipleTagInputComponent;
  let fixture: ComponentFixture<MultipleTagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTagInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
