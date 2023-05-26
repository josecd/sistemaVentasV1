import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialVentaComponent } from './pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';

import { SharedModule } from 'src/app/reutilizable/shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
