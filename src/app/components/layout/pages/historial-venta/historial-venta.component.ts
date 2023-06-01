import { Component,OnInit, AfterViewInit,ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modals/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from "src/app/interfaces/venta";
import { VentaService } from "src/app/services/venta.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";

export const MY_DATA_FORMATS={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    montYearLabel:'MMMM YYYY'
  }
}
@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.scss'],
  providers:[{provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda:FormGroup;
  opcionesBusqueda:any[]=[
    {value:'fecha',descripcion:'Por fechas'},
    {value:'numero',descripcion:'Numero Venta'},
  ]
  columnasTabla:string[]=['fechaRegistro','numeroDocumento','tipoPago','total','acciones']
  dataInicio:Venta[]=[];
  datosLista = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!:MatPaginator;
  constructor(
    private fb: FormBuilder,
    private dialog:MatDialog,
    private _venta:VentaService,
    private _utilidad:UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({
      buscarPor:['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value=>{
      this.formularioBusqueda.patchValue({
        numero:"",
        fechaInicio:"",
        fechaFin:""
      })
    })
  }

  ngAfterViewInit(): void {
    this.datosLista.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event:Event){
    const filterValue =(event.target as HTMLInputElement).value;
    this.datosLista.filter = filterValue.trim().toLocaleLowerCase();
  }

  buscarVenta(){
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format("DD/MM/YYYY")
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format("DD/MM/YYYY")

      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._utilidad.mostrarAlerta("Debe ingresar ambas fechas","Ooops!")
        return;
      }
    }

    this._venta.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next:(data)=>{
        if (data.status) {
          this.datosLista = data.value
        }else{
          this._utilidad.mostrarAlerta("No se encontraron datos","Oops!")
        }
      },
      error(err) {},
    })
  }

  verDetalleVenta(_venta:Venta){
    this.dialog.open(ModalDetalleVentaComponent,{
      data:_venta,
      disableClose:true,
      width:'700px'
    })
  }

  ngOnInit(): void {
  }

}
