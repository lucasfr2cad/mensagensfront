import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable} from 'rxjs';





@Injectable({ providedIn: 'root' })
export class ErroService {



 handleError(err): Observable<never>{
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Um erro ocorreu: ${err.error.message}`;
    } else {
      errorMessage = `O Backend retornou o erro ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }


}
