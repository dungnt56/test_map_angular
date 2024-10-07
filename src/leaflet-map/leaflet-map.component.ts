import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [16.047079, 108.206230], // Toạ độ tại Đà Nẵng, Việt Nam
      zoom: 5
    });

    // Thêm tile từ MapTiler với API Key
    L.tileLayer('https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=MoSM18XqoOPW3oCJdooM&language=en', {
      attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 19
    }).addTo(this.map);
  }

  ngOnInit(): void {
    this.initMap();
  }
    // this.map = L.map('map').setView([21.0285, 105.8542], 13);
    //
    // // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // //   maxZoom: 19,
    // //   attribution: '© OpenStreetMap'
    // // }).addTo(this.map);
    // L.tileLayer('https://api.maptiler.com/maps/basic-vi/{z}/{x}/{y}.png?key=MoSM18XqoOPW3oCJdooM', {
    //   maxZoom: 19,
    //   attribution: '© MapTiler © OpenStreetMap contributors'
    // }).addTo(this.map);
    //
    // const marker = L.marker([21.0285, 105.8542]).addTo(this.map);
    // marker.bindPopup("<b>Chào mừng!</b><br>Đây là Hà Nội, Việt Nam.").openPopup();
  // }
  // constructor() { }

  // ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
