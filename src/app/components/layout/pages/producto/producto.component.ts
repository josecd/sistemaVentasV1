import { Component,OnInit, AfterViewInit,ViewChild } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";
import { ProductoService } from 'src/app/services/producto.service';
import Swal from "sweetalert2";
import { Producto } from 'src/app/interfaces/producto';
import { ModalProductoComponent } from '../../Modals/modal-producto/modal-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  columbasTabla: string[]=['nombre','categoria','stock','precio','estado','acciones'];
  dataInicio:Producto[]=[];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;
  constructor(
    private dialog: MatDialog,
    private _producto:ProductoService,
    private _utilidad: UtilidadService
  ){

  }

  obtenerProductos(){
    this._producto.lista().subscribe({
      next:(data)=>{
        if (data.status) {
          this.dataListaProductos.data = data.value
        }else{
          this._utilidad.mostrarAlerta("No se encontraron datos", "Oopss!")
        }
      },
      error:(e)=>{
      }
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event:Event){
    const filterValue =(event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true
    }).afterClosed().subscribe(res=>{
      if (res === "true") {
        this.obtenerProductos();
      }
    });
  }

  editarProducto(producto:Producto){
    this.dialog.open(ModalProductoComponent,{
      disableClose:true,
      data:producto
    }).afterClosed().subscribe(res=>{
      if (res === "true") {
        this.obtenerProductos();
      }
    });
  }

  eliminarProducto(producto:Producto){
    Swal.fire({
      title:'¿Desea eliminar el producto?',
      text:producto.nombre,
      icon:'warning',
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado)=>{
      if (resultado.isConfirmed) {
        this._producto.Eliminar(producto.idProducto).subscribe({
          next:(data)=>{
            if (data.status) {
              this._utilidad.mostrarAlerta("El producto fue eliminado","Listo!");
              this.obtenerProductos();
            }else{
              this._utilidad.mostrarAlerta("No se pudo eliminar el producto","Error!");
            }
          },error:(err)=> {

          },
        })
      }
    })
  }

}
