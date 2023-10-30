import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const llave = "usuario";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public correo = "";
  constructor() { }

  async obtenerItem(llave:string):Promise<string | null>{
    const item = await Preferences.get({key:llave});
    return item.value;
   }
  
   async setItem(llave:string, valor:string){
    await Preferences.set({key:llave,value:valor});
   }

   async obetenerUsuario(){

    const usuario = await this.obtenerItem(llave);

    if(usuario == null){
      return []
    }

    const user:any[] = JSON.parse(usuario)
    if(user){
      return user
    }else{
      return []
    }
   }

   async agregarUsuario(usuarioNuevo:any[]){

    const user = await this.obetenerUsuario();
    
    for(let i of user){
      if(i){
        usuarioNuevo.push(i);
      }
    }

    this.setItem(llave,JSON.stringify(usuarioNuevo))
   }
  
}
