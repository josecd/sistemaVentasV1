import { Component,OnInit, AfterViewInit,ViewChild } from '@angular/core';

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";

import { ModalUsuarioComponent } from "../../Modals/modal-usuario/modal-usuario.component";
import { Usuario } from "src/app/interfaces/usuario";
import { UsuarioService } from "src/app/services/usuario.service";
import { UtilidadService } from "src/app/reutilizable/utilidad.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit,AfterViewInit {

  columbasTabla: string[]=['nombreCompleto','correo','rolDescripcion','estado','acciones'];
  dataInicio:Usuario[]=[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuario:UsuarioService,
    private _utilidad: UtilidadService
  ){

  }

  obtenerUusarios(){
    this._usuario.lista().subscribe({
      next:(data)=>{
        if (data.status) {
          this.dataListaUsuarios.data = data.value
        }else{
          this._utilidad.mostrarAlerta("No se encontraron datos", "Oopss!")
        }
      },
      error:(e)=>{
      }
    });
  }


  ngOnInit(): void {
    this.obtenerUusarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event:Event){
    const filterValue =(event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(res=>{
      if (res === "true") {
        this.obtenerUusarios();
      }
    });
  }

  editarUsuario(usuario:Usuario){
    this.dialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data:usuario
    }).afterClosed().subscribe(res=>{
      if (res === "true") {
        this.obtenerUusarios();
      }
    });
  }

  eliminarUsuario(usuario:Usuario){
    Swal.fire({
      title:'¿Desea eliminar el usuairo?',
      text:usuario.nombreCompleto,
      icon:'warning',
      confirmButtonColor:"#3085d6",
      confirmButtonText:"Si, eliminar",
      showCancelButton:true,
      cancelButtonColor:"#d33",
      cancelButtonText:"No, volver"
    }).then((resultado)=>{
      if (resultado.isConfirmed) {
        this._usuario.Eliminar(usuario.idUsuario).subscribe({
          next:(data)=>{
            if (data.status) {
              this._utilidad.mostrarAlerta("El usuario fue eliminado","Listo!");
              this.obtenerUusarios();
            }else{
              this._utilidad.mostrarAlerta("No se pudo eliminar el usuario","Error!");
            }
          },error:(err)=> {

          },
        })
      }
    })
  }
}
