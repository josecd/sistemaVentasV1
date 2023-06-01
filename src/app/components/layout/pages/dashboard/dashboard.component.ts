import { Component , OnInit} from '@angular/core';

import { Chart,registerables} from 'chart.js';
import { DashboardService } from "src/app/services/dashboard.service";
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  totalIngresos:string="0";
  totalVentas: string = "0";
  totalProductos: string = "0";


  constructor(
    private _dashboard :DashboardService
  ){

  }


  mostrarGrafico(labelGrafico:any[],dataGrafico:any[]){
    const charBarras = new Chart('chartBarras',{
      type:'bar',
      data:{
        labels:labelGrafico,
        datasets:[{
          label: "#de ventas",
          data:dataGrafico,
          backgroundColor:[
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor:[
            'rgb(255, 99, 132)',
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })

  }


  ngOnInit(): void {
    this._dashboard.resumen().subscribe({
      next:(data)=>{
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos,
          this.totalVentas = data.value.totalVentas,
          this.totalProductos = data.value.totalProductos
          const arrayData: any[]= data.value.ventasUltimaSemana;
          const labelTemp = arrayData.map((value)=>value.fecha);
          const dataTemp = arrayData.map((value)=>value.total);
          this.mostrarGrafico(labelTemp,dataTemp);
        }
      },error(err) {

      },
    })
  }

}
