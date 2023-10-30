import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { Region } from '../models/region';
import { Comuna } from '../models/comuna';
import { StorageService } from '../services/storage.service';
import { HelperService } from '../services/helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  usuarioName:string = '';
  contrasena:string = '';
  regionSeleccionada : number = 0;
  comunaSeleccionada: number = 0;
  seleccionComuna:boolean = true;

  regiones:Region[] = [];
  comunas:Comuna[] = [];
  // Define el formulario y sus controles
  // usuario = new FormGroup({
  //   // usuario: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
  //   contrasena: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]+$')]),
  // });

  constructor(private navCtrl: NavController,
              private locationService:LocationService,
              private helperservice:HelperService,
              private auth:AngularFireAuth,
              private storageUsuario:StorageService,
              private router:Router
    ) { }

  goToLogin(){
    this.navCtrl.navigateForward('/home');
  }

  ngOnInit() {
    this.cargarRegion();

  }

  async cargarRegion(){
    const req = await this.locationService.getRegion();
    this.regiones = req.data;
  }

  async cargarComuna(){
    this.seleccionComuna = false;
    const req = await this.locationService.getComuna(this.regionSeleccionada);
    this.comunas = req.data;
  }

  async registrarUsuario(){

    const loader = await this.helperservice.showLoading("cargando");

    try{

      const request = await this.auth.createUserWithEmailAndPassword(this.usuarioName,this.contrasena);
      var usuario = [{
                      correo:this.usuarioName,
                      contrasena:this.contrasena,
                      region:this.regionSeleccionada,
                      comuna:this.comunaSeleccionada
                     }]
      this.storageUsuario.agregarUsuario(usuario);
      await this.helperservice.showAlert("usuario agregado","info")
      // await this.router.navigateByUrl('/home');
      this.navCtrl.navigateForward('/home')
      await loader.dismiss();
    }catch(error:any){

    }
  }
}
