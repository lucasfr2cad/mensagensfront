import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }

            const error = err.error.message || err.statusText;
            this.showError(err);
            return throwError(error);
        }));
    }

    showError(erro: any): any {
      if (erro.error.ds_erro !== undefined)
      {
        this.toastr.error(erro.error.ds_erro, 'Ops!', {
          closeButton : true,
          disableTimeOut : true
        });
      }
      if (erro.statusText === 'Unknown Error')
      {
        this.toastr.error('Verifique sua conexão!', 'Ops!', {
          closeButton : true,
          disableTimeOut : true
        });
      }
      else{
        this.toastr.error(erro.statusText, 'Ops!', {
          closeButton : true,
          disableTimeOut : true
        });
      }
    }
}
