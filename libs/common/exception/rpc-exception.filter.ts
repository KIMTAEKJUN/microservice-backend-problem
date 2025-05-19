import { Catch, ArgumentsHost, RpcExceptionFilter as IRpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements IRpcExceptionFilter<RpcException> {
  catch(exception: RpcException, _host: ArgumentsHost): Observable<any> {
    const data = exception.getError();
    return of(typeof data === 'string' ? { status: 'error', message: data } : data);
  }
}
