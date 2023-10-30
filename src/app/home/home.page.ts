import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuarioName:string = '';
  contrasena:string = '';


  usuario = new FormGroup({
    usuario: new FormControl('', ),
    contrasena: new FormControl('', Validators.pattern(/^[0-9]+$/))
  });

  constructor(private navCtrl: NavController, private helperservice:HelperService, private aut:AngularFireAuth) {}

  ngOnInit() {
  }

  async ingresarUsuario(){
    const loader = await this.helperservice.showLoading("cargando");

    try{
      const valIngreso = await this.aut.signInWithEmailAndPassword(this.usuarioName, this.contrasena);
      this.navCtrl.navigateForward('/pagina1')
      await loader.dismiss();
    }
    catch(error:any){
      if(error.code == 'auth/invalid-email'){
        await loader.dismiss();
        await this.helperservice.showAlert("Error en el formato del correo","Error");
      }
      if(error.code == 'auth/weak-password'){
        await loader.dismiss();
        await this.helperservice.showAlert("Error del largo de la contraseña ","Error");

        }
    }
  }

   goToRegistro(){
     this.navCtrl.navigateForward('/registro');
   }

  // goToPagina1(){
  //   this.navCtrl.navigateForward('/pagina1');
  // }
}
