import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { Language } from '@maptiler/sdk';
import * as maptiler from '@maptiler/sdk';
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.css'
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  private map: any;

  // private initMap(): void {
  //   // Khởi tạo bản đồ với trung tâm tại Việt Nam
  //   this.map = L.map('map').setView([21.0285, 105.8542], 13);
  //
  //   // Thêm tile layer với ngôn ngữ tiếng Việt (tùy chọn bản đồ có hỗ trợ tiếng Việt)
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '© OpenStreetMap'
  //   }).addTo(this.map);
  //
  //   // Thêm marker với popup hiển thị tiếng Việt
  //   const marker = L.marker([21.0285, 105.8542]).addTo(this.map);
  //   marker.bindPopup("<b>Chào mừng!</b><br>Đây là Hà Nội, Việt Nam.").openPopup();
  // }

  private initMap(): void {
    this.map = L.map('map').setView([21.027, 105.854], 12);
    const street = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
        minZoom: 4,
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        noWrap: true
      }
    )
    street.addTo(this.map);
  }

  ngOnInit(): void {
    this.initMap();
  }
  constructor(private elementRef: ElementRef) { }

  // ngOnInit(): void { }

  ngAfterViewInit(): void {
    // this.initMap();
  }
}
