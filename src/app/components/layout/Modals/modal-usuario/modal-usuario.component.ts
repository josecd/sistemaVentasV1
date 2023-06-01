import { Component, Inject, NgModule, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Rol } from "src/app/interfaces/rol";
import { Usuario } from "src/app/interfaces/usuario";

import { RolService } from "src/app/services/rol.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit   {

  formularioUsuario:FormGroup;
  ocultarPassword:boolean=true;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaRoles: Rol[]=[];

  constructor(
    private  modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rol:RolService,
    private _usuario: UsuarioService,
    private _utilidad:UtilidadService
  ){
    this.formularioUsuario = this.fb.group({
      nombreCompleto:['',Validators.required],
      correo: ['',Validators.required],
      idRol: ['',Validators.required],
      clave: ['',Validators.required],
      esActivo: ['1',Validators.required],
    });

    if (this.datosUsuario != null) {
      this.tituloAccion = "Editar"
      this.botonAccion = 'Actualizar'
    }

    this._rol.lista().subscribe({
      next:(data)=>{
        if (data.status) {
          this.listaRoles = data.value
        }
      },
      error:(e)=>{

      }
    });
  }

  ngOnInit(){
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto:this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esAcivo: this.datosUsuario.esActivo.toString(),
      });
    }
  }

  guardarEditar_Usuario(){
    const _usuario: Usuario ={
      idUsuario:this.datosUsuario == null? 0:this.datosUsuario.idUsuario,
      nombreCompleto:this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion:"",
      clave:this.formularioUsuario.value.clave,
      esActivo:parseInt(this.formularioUsuario.value.esActivo)
    }

    if (this.datosUsuario == null) {

      this._usuario.guardar(_usuario).subscribe({
        next:(data)=>{
          if (data.status) {
            this._utilidad.mostrarAlerta("El usuario fue registrado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidad.mostrarAlerta("No se pudo registrar el usuario.", "Error")
          }
        },
        error(err) {

        },
      })
    }else{
      this._usuario.editar(_usuario).subscribe({
        next:(data)=>{
          if (data.status) {
            this._utilidad.mostrarAlerta("El usuario fue editado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidad.mostrarAlerta("No se pudo editar el usuario.", "Error")
          }
        },
        error(err) {

        },
      })
    }
  }

}
