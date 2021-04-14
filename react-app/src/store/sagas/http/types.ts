import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export type HttpMethod = 'GET' | 'POST'// | 'PUT' | 'DELETE'

export interface HttpRequestPayload {
  context?: any,
}
export interface GetRequestPayload extends HttpRequestPayload {
  queries?: Record<string, string>
  headers?: Record<string, string>,
}
export interface PostRequestPayload<B> extends HttpRequestPayload {
  headers?: Record<string, string>,
  body?: B,
}
export interface HttpSuccessPayload<T> {
  response: T,
  context?: any,
}
export type HttpSagaConfig<R> = {
  method: HttpMethod,
  path: string,
  action: string,
  successAction: ActionCreatorWithPayload<HttpSuccessPayload<R>>,
}

export interface GetHttpSagaConfig<R> extends HttpSagaConfig<R> {
  method: 'GET'
}
export interface PostHttpSagaConfig<R> extends HttpSagaConfig<R> {
  method: 'POST'
}
