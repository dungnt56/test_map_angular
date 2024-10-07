import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import MapboxLanguage from "@mapbox/mapbox-gl-language";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
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

    // Chuyển ngôn ngữ sang tiếng Việt sau khi bản đồ được tải
    this.map.on('load', () => {
      this.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_vi']);
    });
    this.map.addControl(new MapboxLanguage({
      defaultLanguage: 'vi'  // Đặt ngôn ngữ mặc định là tiếng Việt
    }));
  }
}
