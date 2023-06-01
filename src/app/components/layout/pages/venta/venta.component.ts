import { Component,OnInit } from '@angular/core';

import { FormBuilder , FormGroup,Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";

import { ProductoService } from "src/app/services/producto.service";
import {  VentaService} from "src/app/services/venta.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";

import { Producto } from "src/app/interfaces/producto";
import { Venta } from "src/app/interfaces/venta";
import {  DetalleVenta} from "src/app/interfaces/detalle-venta";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit{

  listaProductos: Producto[]=[];
  listaProductosFiltro: Producto[]=[];

  listaProductosParaVenta: DetalleVenta []=[];
  bloquearBotonRegistra: boolean =false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto:string = "Efectivo";
  totalPagar:number=0;

  formularioProductoVenta:FormGroup;
  columnasTabla:string[]=['producto','cantidad','precio','total','acciones'];
  datoDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retomarProductosPorFiltro(busqueda:any): Producto[]{
    const valorBuscado = typeof busqueda === "string"?busqueda.toLocaleLowerCase():busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item=>item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb:FormBuilder,
    private _producto: ProductoService,
    private _venta: VentaService,
    private _utilidad:UtilidadService
  ){
    this.formularioProductoVenta = this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required]
    });

    this._producto.lista().subscribe({
      next:(data)=>{
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p=>p.esActivo == 1 && p.stock >0);
        }
      },
      error:(e)=>{}
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value=>{
      this.listaProductosFiltro = this.retomarProductosPorFiltro(value);
    })


  }

  ngOnInit(): void {
  }

  mostrarProducto(producto:Producto):string{
    return producto.nombre;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(){
    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    const _precio:number = parseFloat(this.productoSeleccionado.precio);
    const _total:number = _cantidad * _precio;

    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto:  String(_total.toFixed(2))
    })

    this.datoDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad:''
    })
  }

  eliminarProducto(detalle:DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p=>p.idProducto != detalle.idProducto);
    this.datoDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  registrarVenta(){
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistra = true;
      const request: Venta = {
        tipoPago:this.tipoPagoPorDefecto,
        totalTexto:String(this.totalPagar.toFixed(2)),
        detalleVenta : this.listaProductosParaVenta
      }

      this._venta.registrar(request).subscribe({
        next:(response)=>{
          if (response.status) {

            this.totalPagar = 0.00;
            this.listaProductosParaVenta =[];
            this.datoDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
            Swal.fire({
              icon:'success',
              title:'Venta Registrada',
              text:`Numero de venta ${response.value.numeroDocumento}`
            })
          }else{
            this._utilidad.mostrarAlerta('No se pudo registrar la venta',"Oops!")
          }
        },
        complete:()=>{this.bloquearBotonRegistra  = false;},
        error(err) {},
      })
    }
  }


}
