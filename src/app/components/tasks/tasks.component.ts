import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-tasks',
  imports: [TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  @Input({ required: true }) tasks: any = [];
  @Output() editTask = new EventEmitter<any>();
  onDeleteTask(taskId: string) {
    const updatedTasks = this.tasks.filter((task: any) => task._id !== taskId);

    this.tasks = updatedTasks;
  }
  onEditTask(task: any) {
    this.editTask.emit(task);
  }
  filterTasks(event: any) {
    console.log(event.target.value);
    const filterString = event.target.value;
    if (!filterString) {
      return;
    }

    const filter = filterString.split(':')[0];
    const value = filterString.split(':')[1];

    this.tasks = this.tasks.filter((task: any) => task[filter] == value);
  }
}
