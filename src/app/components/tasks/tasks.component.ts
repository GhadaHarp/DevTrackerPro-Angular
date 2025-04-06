import {
  Component,
  EventEmitter,
  Input,
  input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  imports: [TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit, OnChanges {
  @Input({ required: true }) tasks: any = [];
  @Output() editTask = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<any>();
  filteredTasks: any[] = [];
  ngOnInit(): void {
    this.filteredTasks = this.tasks;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks'] && changes['tasks'].currentValue) {
      this.filteredTasks = [...changes['tasks'].currentValue];
    }
  }

  onDeleteTask(taskId: string) {
    console.log('Deleting task:', taskId);
    this.filteredTasks = this.filteredTasks.filter(
      (task: any) => task._id !== taskId
    );

    this.tasks = this.tasks.filter((task: any) => task._id !== taskId);
  }

  onEditTask(task: any) {
    this.editTask.emit(task);
  }

  filterTasks(event: any) {
    const filterString = event.target.value;

    if (!filterString) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    if (filterString === 'all') {
      this.filteredTasks = [...this.tasks];
      return;
    }

    const [filter, value] = filterString.split(':');

    this.filteredTasks = this.tasks.filter(
      (task: any) => task[filter] === value
    );
  }
}
