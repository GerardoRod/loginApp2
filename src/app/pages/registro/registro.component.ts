import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  rememberMe: boolean = false;


  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit() {
   }

   onSubmit( form: NgForm ){

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });

    if (form.invalid) { return; }

    this.auth.nuevoUsuario( this.usuario )
    .subscribe( resp => {
      console.log( resp );
      Swal.close;
      if ( this.rememberMe ){
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        title: 'Error al crear tu cuenta',
        text: err.error.error.message,
      });
    });

   }

}
