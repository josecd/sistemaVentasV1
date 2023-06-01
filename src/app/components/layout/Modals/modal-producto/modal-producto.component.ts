import { Component, Inject, NgModule, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Categoria } from "src/app/interfaces/categoria";
import { Producto } from "src/app/interfaces/producto";
import { CategoriaService } from "src/app/services/categoria.service";
import { ProductoService } from "src/app/services/producto.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit{

  formularioProducto:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaCategorias: Categoria[]=[];

  constructor(
    private  modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoria: CategoriaService,
    private _producto:ProductoService,
    private _utilidad: UtilidadService
  ){
    this.formularioProducto = this.fb.group({
      nombre:['',Validators.required],
      idCategoria: ['',Validators.required],
      stock: ['',Validators.required],
      precio: ['',Validators.required],
      esActivo: ['1',Validators.required],
    });

    if (this.datosProducto != null) {
      this.tituloAccion = "Editar"
      this.botonAccion = 'Actualizar'
    }

    this._categoria.lista().subscribe({
      next:(data)=>{
        if (data.status) {
          this.listaCategorias = data.value
        }
      },
      error:(e)=>{}
    });
  }

  ngOnInit(){
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre:this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esAcivo: this.datosProducto.esActivo.toString(),
      });
    }
  }

  guardarEditar_Producto(){
    const _producto: Producto ={
      idProducto:this.datosProducto == null? 0:this.datosProducto.idProducto,
      nombre:this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria:'',
      stock: this.formularioProducto.value.stock,
      precio: this.formularioProducto.value.precio,
      esActivo:parseInt(this.formularioProducto.value.esActivo)
    }

    if (this.datosProducto == null) {

      this._producto.guardar(_producto).subscribe({
        next:(data)=>{
          if (data.status) {
            this._utilidad.mostrarAlerta("El productos fue registrado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidad.mostrarAlerta("No se pudo registrar el producto.", "Error")
          }
        },
        error(err) {

        },
      })
    }else{
      this._producto.editar(_producto).subscribe({
        next:(data)=>{
          if (data.status) {
            this._utilidad.mostrarAlerta("El producto fue editado", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidad.mostrarAlerta("No se pudo editar el producto.", "Error")
          }
        },
        error(err) {

        },
      })
    }
  }


}
