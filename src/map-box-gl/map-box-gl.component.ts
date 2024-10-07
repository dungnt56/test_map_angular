import {Component, OnInit} from '@angular/core';
import * as mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

@Component({
  selector: 'app-map-box-gl',
  standalone: true,
  imports: [],
  templateUrl: './map-box-gl.component.html',
  styleUrl: './map-box-gl.component.css'
})
export class MapBoxGlComponent implements OnInit  {
  map!: mapboxgl.Map;
  title = 'testMap';
  ngOnInit(): void {

    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZHVuZ250MTIzIiwiYSI6ImNsb3pxaHBrdDAzMXEycm9pNmFrZXVhMjgifQ._w9iZO7cEPaolJKLbLPhUg',
      container: 'map',  // ID của container trong HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [106.660172, 10.762622],  // Tọa độ trung tâm (VD: TP. Hồ Chí Minh)
      zoom: 12,
      language: 'vi',  // Chuyển ngôn ngữ sang tiếng Việt
      projection: 'globe'
    });

    const language = new MapboxLanguage({
      defaultLanguage: 'vi', // Vietnamese
    // @ts-ignore
      languages: ['vi', 'en'] // Add more languages as needed
    });
    this.map.addControl(language);
    // Chuyển ngôn ngữ sang tiếng Việt sau khi bản đồ được tải
    this.map.on('load', () => {
      this.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_vi']);
    });
    // this.map.addControl(new MapboxLanguage({
    //   defaultLanguage: 'vi'  // Đặt ngôn ngữ mặc định là tiếng Việt
    // }));
  }

}
