import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { } from 'googlemaps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('map', { static: true })
  mapElement!: ElementRef;
  map!: google.maps.Map;

  title = 'Tracking';
  dataUrl = 'https://run.mocky.io/v3/cce8424a-4188-4d0c-8143-90961b05e5b2';
  partnersList: Array<any> = [];
  partnerName: string = '';
  partnerId: string = '';
  partnerStatus: string = '';
  partnerNum: number = 0;
  partnerStatusColor: string = '';
  showPartnerDetails: boolean = false;
  partnerStops: Array<any> = [];
  partnerData: Array<any> = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get(this.dataUrl).subscribe((response: any) => {
      this.partnersList = this.partnerData = response;
      this.partnerData.forEach(partner => {
        if (partner.pStatus === 'IDLE') {
          partner.pStatusColor = '#F0B859';
        } else if (partner.pStatus === 'INACTIVE') {
          partner.pStatusColor = '#CF2121';
        } else {
          partner.pStatusColor = '#16A085';
        }
      });
    });
    this.initMap();
  }

  getPartnerDetails(partner: any) {
    this.showPartnerDetails = true;
    this.partnerName = partner.pName;
    this.partnerId = partner.pId;
    this.partnerNum = partner.pNum;
    this.partnerStatus = partner.pStatus;
    this.partnerStatusColor = partner.pStatusColor;
    this.partnerStops = partner.stops;
  }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const mapProperties = {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
      });
    }
  }

  filterData(searchKeyword: string) {
    let result: any[] = [];
    this.partnerData = this.partnersList;
    this.partnerData.forEach(partner => {
      for (let key in partner) {
        if (typeof partner[key] == 'string'
          && partner[key].toLowerCase().includes(searchKeyword.toLowerCase())
          && !(result.includes(partner))) {
          result.push(partner);
        }
      }
    });
    this.partnerData = result;
  }
}
