import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PenTestService {
  url: string = 'http://192.168.0.104:5001';

  constructor() { }
}
