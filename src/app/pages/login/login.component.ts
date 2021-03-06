import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  rememberMe: boolean = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {

    if ( localStorage.getItem('email') ){
      this.usuario.email = localStorage.getItem('email');
      this.rememberMe  = true;
    }

  }

  login( form: NgForm ){
    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });

    Swal.showLoading();

    this.auth.login( this.usuario )
    .subscribe( resp => {
      console.log(resp);
      Swal.close();

      if ( this.rememberMe ){
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home');

    }, (err) => {
      Swal.fire({
        title: 'Error al autenticar',
        text: err.error.error.message,
      });
    });
  }

}
