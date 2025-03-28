import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Data, Router } from '@angular/router';
import { APIService } from '../../services/API.service';
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum Status {
  NotStarted = 'not-started',
  InProgress = 'in-rogress',
  Completed = 'completed',
}

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) project!: any;
  @Input() currTaskData!: any;
  isEditing = false;
  enteredTitle = '';
  enteredDescription = '';
  enteredDate = '';
  enteredPriority = '';
  enteredStatus = '';

  newTaskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),
    priority: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
  });
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currTaskData'] && this.currTaskData) {
      this.isEditing = true;
      this.enteredTitle = this.currTaskData.title;
      this.enteredDescription = this.currTaskData.description;
      this.enteredPriority = this.currTaskData.priority;
      this.enteredStatus = this.currTaskData.status;
      const date = new Date(this.currTaskData.deadline);
      this.enteredDate = date.toISOString().split('T')[0];
      this.newTaskForm.setValue({
        title: this.enteredTitle,
        description: this.enteredDescription,
        dueDate: this.enteredDate,
        priority: this.enteredPriority,
        status: this.enteredStatus,
      });
    } else {
      this.isEditing = false;
      this.newTaskForm.reset();
    }
  }
  token = localStorage.getItem('token') || '';
  private apiService = inject(APIService);

  private router = inject(Router);

  onCancel() {
    this.close.emit();
  }
  onSubmit() {
    if (this.currTaskData) {
      this.apiService
        .editTask(
          this.currTaskData._id,
          {
            title: this.enteredTitle,
            description: this.enteredDescription,
            dueDate: this.enteredDate,
            priority: this.enteredPriority,
            status: this.enteredStatus,
            deadline: this.enteredDate,
          },
          this.token
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.addTask.emit(res.data);
            this.close.emit();
          },
          (error) => {
            console.log(error);

            this.router.navigate(['/error'], {
              state: { message: error.error.message },
            });
          }
        );
      return;
    }
    this.apiService
      .addTask(
        {
          title: this.enteredTitle,
          description: this.enteredDescription,
          dueDate: this.enteredDate,
          projectId: this.project,
          priority: this.enteredPriority,
          status: this.enteredStatus,
          deadline: this.enteredDate,
        },
        this.token
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.addTask.emit(res.data);

          this.close.emit();
        },
        (error) => {
          console.log(error);
          if (error.status == 403) {
            this.router.navigate(['/payment']);
          } else {
            this.router.navigate(['/error'], {
              state: { message: error.error.message },
            });
          }
        }
      );
  }
}
