import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { Observable, retry, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private messageService: MessageService,
                private router: Router) {

    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            retry(1),
            tap(
            (event: HttpEvent<any>) => event,
            (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 403) {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: `You don't have access to this page`, life: 3000}); 
                        this.router.navigate(['/home']);
                    } else if (error.status === 404) {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: `Not Found`, life: 3000});
                        this.router.navigate(['/home']);
                    } else if (error.status === 400) {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: error.error, life: 3000});
                    } else if (error.status === 500) {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: `Internal Server Error`, life: 3000});  
                        this.router.navigate(['/home']);
                    } else if (error.status === 401) {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: `Unauthorized`, life: 3000});   
                        this.router.navigate(['/home']);
                    } else {
                        this.messageService.add({key: 'tc', severity:'error', summary: 'Error', detail: `Unknown Server Error`, life: 3000}); 
                        this.router.navigate(['/home']);
                    }

                }
            })
        );
    }
}