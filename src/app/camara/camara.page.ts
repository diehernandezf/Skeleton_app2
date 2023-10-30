import { Component, OnInit, ViewChild, VERSION } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { BarcodeFormat } from '@zxing/library';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage implements OnInit {

  ngVersion = VERSION.full;
  @ViewChild('scanner', { static: true })
  scanner!: ZXingScannerComponent;

  hasDevices!: boolean;
  hasPermission!: boolean;
  qrResultString!: string;
  qrResult!: Result;
  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;

  imagenes:any[] = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit(): void {
    defineCustomElements(window);
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;

      // selects the devices's back camera by default
      for (const device of devices) {
          if (/back|rear|environment/gi.test(device.label)) {
              new this.scanner.deviceChange();
              this.currentDevice = device;
              break;
          }
      }
    });

    this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);

  }

  async takePhoto(){

    var cSourse = CameraSource.Prompt;

    if ((await Camera.checkPermissions()).camera == 'granted') {
      const image = await Camera.getPhoto({resultType: CameraResultType.Uri,
          quality:100,
          height:1024,
          width:1024,
          source:cSourse,
          presentationStyle:'popover',
          promptLabelCancel: 'Cancelar',
          promptLabelPhoto: 'Desde la galeria',
          promptLabelPicture: 'Desde la camara',
          promptLabelHeader: 'Seleccione'
      });

      if (image.webPath) {
            var blob = (await fetch(image.webPath)).blob();
          this.imagenes.unshift({fname:'foto'+ image.format,src:image.webPath,file:blob})
      }

      console.log('IMAGENES GUARDADAS ===>', this.imagenes);



    }
  }

  handleQrCodeResult(resultString: string) {
    console.log('Result:   ', resultString);
    const componentes = resultString.split(',');
    const datos: { [key: string]: string } = {};
    componentes.forEach(componente => {
      const [nombre, valor] = componente.split(':');
      datos[nombre.trim()] = valor.trim();
    });
    this.navCtrl.navigateForward('usuarios');
    localStorage.setItem('profesor',JSON.stringify(datos));
    console.log('Datos guardados en el localStorage:', datos);

  }
  formats: BarcodeFormat[] = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.EAN_13,
  BarcodeFormat.CODE_128,
  BarcodeFormat.DATA_MATRIX
];

}

