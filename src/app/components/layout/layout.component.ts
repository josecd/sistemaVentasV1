import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[]=[];
  correUsuario:string= '';
  rolUsuario: string='';

  constructor(
    private router:Router,
    private _menu:MenuService,
    private _utilidad:UtilidadService
  ){

  }
  ngOnInit(): void {
    const usuario = this._utilidad.obtenerSesionUsuario();
    if (usuario!=null) {
      this.correUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion
    }

    this._menu.lista(usuario.idUsuario).subscribe({
      next:(data) =>{
        if (data.status) {
          this.listaMenus = data.value
        }
      },
      error(err) {},
    })
  }

  cerrarSesion(){
    this._utilidad.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }

}
