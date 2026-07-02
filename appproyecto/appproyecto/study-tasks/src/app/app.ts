import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudyTask } from './interfaces/study-task';
import { TaskService } from './service/task.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  appTitle = 'Study Tasks';
 tasks: StudyTask[] = [];
  newTaskTitle = '';
  loading = true;
  newTaskSubject = '';

constructor(private service: TaskService, private cdr: ChangeDetectorRef) {}

   ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.service.getTasks().subscribe({
      next: (data) => {
        console.log('Tareas cargadas:', data);
        this.tasks = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges(); 
      }
    });
  }



  addTask() {
    if (this.newTaskTitle.trim() === '' || this.newTaskSubject.trim() === '') {
      return;
    }

    
    const taskToSend = {
      title: this.newTaskTitle,
      subject: this.newTaskSubject,
      completed: false
    };

    this.loading = true; 

    this.service.createTask(taskToSend).subscribe({
      next: (createdTask: StudyTask) => {
        console.log('Tarea creada en la API:', createdTask);
        this.tasks.push(createdTask); 
        
      
        this.newTaskTitle = '';
        this.newTaskSubject = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al crear tarea:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleTask(task: StudyTask) {

    const updatedStatus = !task.completed;

    this.service.updateTask(task.id, { completed: updatedStatus }).subscribe({
      next: (updatedTask) => {
        console.log('Tarea actualizada en la API:', updatedTask);
        task.completed = updatedStatus; 
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al actualizar tarea:', err)
    });
  }

  deleteTask(taskId: any) {
    this.service.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Tarea borrada de la API con ID:', taskId);
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al borrar tarea:', err)
    });
  }

  get pendingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }

    
}