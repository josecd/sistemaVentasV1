import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder,FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Rol } from "src/app/interfaces/rol";
import { Usuario } from "src/app/interfaces/usuario";

import { RolService } from "src/app/services/rol.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import { Venta } from 'src/app/interfaces/venta';
@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.scss']
})
export class ModalDetalleVentaComponent implements OnInit{

  fechaRegistro:string="";
  numeroDocumento:string="";
  tipoPago: string = "";
  total: string="";
  detalleVenta:DetalleVenta[]=[];
  columnasTabla:string[]=["producto",'cantidad','precio','total']

  constructor(
    @Inject(MAT_DIALOG_DATA) public _venta:Venta
  ){
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total  = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {
  }
}
