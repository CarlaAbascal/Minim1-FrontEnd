import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Comment } from '../../models/comment.model'; 
import { CommentService } from '../../services/comment/comment.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postId!: string; // Recibir el postId como un input del componente
  comments: Comment[] = []; 
  desplegado: boolean[] = []; 
  errorMessage: string | null = null;

  nuevoComentario: Comment = {
    author: '',
    content: '',
    postDate: new Date(),
    postId: this.postId
  };

  comentarioEdicion: Comment | null = null; 
  indiceEdicion: number | null = null; 
  formSubmitted: boolean = false; 

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.postId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    // Llamar al servicio para obtener los comentarios
    this.commentService.getComments(this.postId).subscribe(data => {
      this.comments = data; 
      this.desplegado = new Array(this.comments.length).fill(false);
    });
  }

  agregarComentario(commentForm: NgForm): void {
    this.formSubmitted = true;

    if (this.indiceEdicion !== null) {
      this.comments[this.indiceEdicion] = { ...this.nuevoComentario, _id: this.comments[this.indiceEdicion]._id };

      this.commentService.updateComment(this.comments[this.indiceEdicion]._id!, this.comments[this.indiceEdicion]).subscribe(response => {
        console.log('Comentario actualizado:', response);
      });

      this.indiceEdicion = null;
    } else {
      const comentarioJSON: Comment = { ...this.nuevoComentario, postId: this.postId };

      this.commentService.createComment(this.postId, comentarioJSON).subscribe(response => {
        console.log('Comentario agregado:', response);
        comentarioJSON._id = response._id; 
        this.comments.push({ ...comentarioJSON });
        this.desplegado.push(false); 
      });
    }

    this.resetForm(commentForm);
  }

  resetForm(commentForm: NgForm): void {
    this.nuevoComentario = {
      author: '',
      content: '',
      postDate: new Date(),
      postId: this.postId
    };
    this.formSubmitted = false; 
    commentForm.resetForm(); 
  }

  prepararEdicion(comentario: Comment, index: number): void {
    this.comentarioEdicion = { ...comentario }; 
    this.nuevoComentario = { ...comentario }; 
    this.indiceEdicion = index; 
    this.desplegado[index] = true; 
  }

  eliminarComentario(index: number): void {
    const comentarioAEliminar = this.comments[index];
    console.log(comentarioAEliminar);

    if (!comentarioAEliminar._id) {
      console.error('El comentario no tiene un _id válido. No se puede eliminar.');
      alert('El comentario no se puede eliminar porque no está registrado en la base de datos.');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar el comentario de ${comentarioAEliminar.author}?`)) {
      this.commentService.deleteComment(this.postId, comentarioAEliminar._id).subscribe(
        response => {
          console.log('Comentario eliminado:', response);
          this.comments.splice(index, 1);
          this.desplegado.splice(index, 1);
        },
        error => {
          console.error('Error al eliminar el comentario:', error);
          alert('Error al eliminar el comentario. Por favor, inténtalo de nuevo.');
        }
      );
    }
  }

  toggleDesplegable(index: number): void {
    this.desplegado[index] = !this.desplegado[index];
  }
}
