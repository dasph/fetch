# FETCH

> small (<50 loc) wrapper for https request creation in NodeJS

## Installation

`npm i git://github.com/daspharion/fetch.git`

## Usage

```
import { fetch } from 'fetch'
```

fetching a json response

```
const data = fetch<ResponseType>('https://jsonplaceholder.typicode.com/todos/1').then(({ json }) => json())
```

sending a JSON payload (as body) to a server

```
const payload = { id: 5, value: 'a string' }
const res = fetch('https://yourwebsite.com/api/method', JSON.stringify(payload)).then(({ json }) => json())
```

## Additional

you can construct your api server so that you always receive a HTTP response with code 200 and a JSON object with three possible fields:

```
export type TResponse <T> = {
  code: number;
  error: string;
  data: T;
}
```

in case of a successfull reponse, the client receives `{ code: 200, data: * }`, where `data` is going to be of type `T`

```
type TUserName = {
    firstName: string;
    lastName: string;
}

const { firstName, lastName } = await fetch<TUserName>('/api/getUserName/96`).then(({ data }) => data())
```

if server responds with an error, an instance of `ApiError` will be thrown
