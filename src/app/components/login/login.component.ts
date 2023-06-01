import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Login } from "src/app/interfaces/login";
import { UsuarioService } from "src/app/services/usuario.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  formularioLogin:FormGroup;
  ocultarPassword:boolean=true;
  mostrarLoading:boolean=false;

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private _usuario:UsuarioService,
    private _utilidad:UtilidadService
  ){
    this.formularioLogin = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  iniciarSesion(){
    this.mostrarLoading = true;
    const request:Login={
      correo:this.formularioLogin.value.email,
      clave:this.formularioLogin.value.password,
    }
    this._usuario.iniciarSesion(request).subscribe({
      next:(data)=>{

        if (data.status) {

          this._utilidad.guardarSesionUsuario(data.value)
          this.router.navigate(["pages"])
        }else{
          this._utilidad.mostrarAlerta('No se encontro coincidencia',"Opps!")
        }
      },
      complete:()=>{
        this.mostrarLoading=false;
      },
      error:()=>{
        this._utilidad.mostrarAlerta("Hubo un error","Opps!")
      }
    })
  }
}
