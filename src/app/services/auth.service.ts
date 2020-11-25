import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyBDVCApyFuiJst4Wvn74_yx4hUJMXtdbgw';

  userToken?: string ;


  // Crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]


  // Para iniciar Sesion
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient ) {
    this.readToken();
  }


  logout() {
  localStorage.removeItem( 'token' );
  }

  login( usuario: UsuarioModel ){

    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(
      `${ this.url }/accounts:signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );

  }

  nuevoUsuario( usuario: UsuarioModel ){

    const authData = {
      // email: usuario.email,
      // password: usuario.password,  esto se puede optimizar haciendo un llamado a todo el modelo usuario de la siguiente forma.
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/accounts:signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['idToken'] );
        return resp;
      })
    );

  }

  private saveToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expire', hoy.getTime().toString() );

  }

  readToken(){

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAutenticated(): boolean{

    if ( this.userToken.length <2 ){
      return false;
    } 

    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if ( expireDate > new Date () ){
      return true;
    } else {
      return false;
    }


    return this.userToken.length > 2;
  }


}
