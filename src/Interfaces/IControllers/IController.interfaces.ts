import * as grpc from '@grpc/grpc-js';
export interface IAdminController {
    Login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>
}