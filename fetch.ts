import { IncomingMessage } from 'http'
import { request, RequestOptions } from 'https'

export type TResponse <T> = {
  code: number;
  error: string;
  data: T;
}

export class ApiError extends Error {
  constructor (public code: number, message?: string) { super(message) }
}

export const digest = (stream: IncomingMessage) => {
  return new Promise<Buffer>((resolve, reject) => {
    const data: Array<Buffer> = []
    stream.on('data', (chunk) => data.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(data)))
    stream.on('error', reject)
  })
}

export const serve = <T> (stream: IncomingMessage) => {
  const buffer = () => digest(stream)
  const body = () => buffer().then((b) => b.toString())
  const json = () => body().then((b) => JSON.parse(b) as T)
  const data = () => body().then((b) => JSON.parse(b) as TResponse<T>).then(({ code, error, data }) => {
    if (error) throw new ApiError(code, error)
    return data
  })

  return { stream, buffer, body, json, data }
}

export const fetch = <T> (options: string | RequestOptions, payload?: string) => {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const req = request(options, resolve).on('error', () => reject(new ApiError(500, 'Something bad has happened on the server')))
    if (payload) req.write(payload)
    req.end()
  }).then((s) => serve<T>(s))
}
