import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminData, AdminData$ } from '../../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDataService {
  private adminData$: BehaviorSubject<AdminData$ | null>;
  constructor() {
    this.adminData$ = new BehaviorSubject<AdminData$ | null>(null);
  }

  get adminData(): Observable<AdminData$> {
    return this.adminData$.asObservable();
  }
  setAdminData(newData: AdminData) {
    this.adminData$.next({ ...this.adminData$.value!, ...newData! });
  }
  
}
