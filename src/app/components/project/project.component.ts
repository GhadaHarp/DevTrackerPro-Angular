import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { TasksComponent } from '../tasks/tasks.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
// import { APIService } from '../../services/API.service';
@Component({
  selector: 'app-project',
  imports: [TasksComponent, FontAwesomeModule, DatePipe, CommonModule],
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
  @Output() deleteTask = new EventEmitter<any>();
  onDeleteProject() {
    this.deleteProject.emit(this.project()._id);
  }
  onEditProject() {
    this.editProject.emit(this.project()._id);
  }
  onAddTask() {
    this.addTask.emit(this.project()._id);
  }
  onEditTask(task: any) {
    this.editTask.emit(task);
  }
  onDeleteTask(task: any) {
    this.deleteProject.emit(task);
  }
}
