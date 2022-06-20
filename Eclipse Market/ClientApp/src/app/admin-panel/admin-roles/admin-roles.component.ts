import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss']
})
export class AdminRolesComponent implements OnInit {

  tableCols?: any[];
  tableRows?: any[];
  sourceAttributes?: any[];
  allRoleClaims?: any[];
  roleClaims?: any[];


  constructor() { }

  ngOnInit() {

    this.tableCols = [
      { "header": "Име" },
      { "header": "Клеймове" }
    ];

    this.allRoleClaims = [
      { value: "1", label: "DataA" },
      { value: "2", label: "DataB" },
      { value: "3", label: "DataC" },
      { value: "4", label: "DataD" },
      { value: "5", label: "DataE" },
      { value: "6", label: "DataF" },
      { value: "7", label: "DataG" },
      { value: "8", label: "DataH" }
    ];
    this.sourceAttributes = [
      { value: "1", label: "DataA" },
      { value: "2", label: "DataB" },
      { value: "3", label: "DataC" },
      { value: "4", label: "DataD" },
      { value: "5", label: "DataE" },
      { value: "6", label: "DataF" },
      { value: "7", label: "DataG" },
      { value: "8", label: "DataH" }
    ];


    //mappingRows: any[];
    this.tableRows = [
      { "targetCol": "DataC", "SourceCol": "Data1" }
    ];

  }
}
