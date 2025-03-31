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
  filteredTasks: any[] = [];
  // sortedTasks: any[] = [];
  ngOnInit(): void {
    this.filteredTasks = this.tasks;
    // console.log(this.filteredTasks);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks'] && changes['tasks'].currentValue) {
      this.filteredTasks = [...changes['tasks'].currentValue];
    }
  }

  // onDeleteTask(taskId: string) {
  //   const updatedTasks = this.tasks.filter((task: any) => task._id !== taskId);

  //   this.tasks = updatedTasks;
  // }
  onDeleteTask(taskId: string) {
    console.log('Deleting task:', taskId);
    this.filteredTasks = this.filteredTasks.filter(
      (task: any) => task._id !== taskId
    );

    this.tasks = this.tasks.filter((task: any) => task._id !== taskId); // ✅ Update main tasks array

    // this.cdr.detectChanges(); // ✅ Force UI refresh
  }

  onEditTask(task: any) {
    this.editTask.emit(task);
  }
  // filterTasks(event: any) {
  //   // console.log(event.target.value);
  //   const filterString = event.target.value;
  //   if (!filterString) {
  //     // console.log('none');
  //     return;
  //   }

  //   const filter = filterString.split(':')[0];
  //   const value = filterString.split(':')[1];
  //   // console.log(filter);
  //   if (filter === 'all') {
  //     this.filteredTasks = this.tasks;
  //   }

  //   this.filteredTasks = this.tasks.filter(
  //     (task: any) => task[filter] == value
  //   );
  // }
  filterTasks(event: any) {
    const filterString = event.target.value;

    if (!filterString) {
      this.filteredTasks = [...this.tasks]; // Reset to all tasks
      return;
    }

    if (filterString === 'all') {
      this.filteredTasks = [...this.tasks]; // Show all tasks
      return;
    }

    const [filter, value] = filterString.split(':');

    this.filteredTasks = this.tasks.filter(
      (task: any) => task[filter] === value
    );
  }

  // sortTasks(event: any) {
  //   console.log(event.target.value);
  // }
}
