import { Component, EventEmitter, input, Output } from '@angular/core';
import { TasksComponent } from '../tasks/tasks.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
// import { APIService } from '../../services/API.service';
@Component({
  selector: 'app-project',
  imports: [TasksComponent, FontAwesomeModule, DatePipe],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  faTrash = faTrash;
  faEdit = faEdit;
  project = input.required<any>();
  @Output() deleteProject = new EventEmitter<any>();
  @Output() editProject = new EventEmitter<any>();
  @Output() addTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  // constructor(private apiService:APIService){}
  onDeleteProject() {
    this.deleteProject.emit(this.project()._id);
    // console.log(this.project());
  }
  onEditProject() {
    this.editProject.emit(this.project()._id);
    // console.log(this.project());
  }
  onAddTask() {
    this.addTask.emit(this.project()._id);
  }
  onEditTask(task: any) {
    this.editTask.emit(task);
  }
}
