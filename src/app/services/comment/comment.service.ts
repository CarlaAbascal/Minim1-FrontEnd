import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  constructor(private http: HttpClient) { }

  // Obtener todos los comentarios de un post específico
  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  // Crear un nuevo comentario
  createComment(postId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}`, comment);
  }

  // Actualizar un comentario por ID
  updateComment(id: string, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
  }

  // Eliminar un comentario por ID
  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${postId}/${commentId}`);
  }

  // Obtener un comentario por ID
  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }
}
