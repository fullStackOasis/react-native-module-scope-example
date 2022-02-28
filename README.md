# Be Careful with module-level variables

Example of problem code that can result in bugs.

`ConnectService` has a module-level `retryCount` variable that might be set over and over again, depending on how `updateUser` and ``updateUser2` are called. This causes a bug with the retry mechanism.

`NewConnectService` does not use a module-level variable. Instead, there's a variable that's set within `fetchData`, passed into the `fetchRetry` method which acts as a closure, and from there the `retryCount` variable is scoped to the `Promise`. So it increments its own `retryCount` variable and doesn't touch anything else.

You can demo the code on Android by doing `npm install`, then start metro server:

```
npx react-native start
```

and install on your device:

```
npx react-native run-android
```

This assumes you know what you're doing (have USB debugging set up).

At this point, you can turn off wifi and check the output of metro server to see how `componentDidMount` in the two separate components, `HelloWorldApp` and `AnotherWorldApp`, the wrong number of times - only 6 times total, when you expect it to be called 6 times for each component.

`HelloWorldApp` calls `ConnectService.updateUser2` and `AnotherWorldApp` calls `ConnectService.updateUser`. The code expects that each method should get retried 6 times, but in fact each method gets retried only 3 times. This is the bug.

Using `NewConnectService` fixes the bug.

To demo the fix, pass props `useNew` as `true` in `App`'s `AnotherWorldApp` and `HelloWorldApp` components. To demo the bug, pass props `useNew` set to false.

# Output for useNew set to false

Here's the output when useNew is set to false, demonstrating the bug:

```
LOG  ConnectService file is loading... retryCount is 0
 LOG  NewConnectService file is loading...
 LOG  Running "TestScope" with {"rootTag":11}
 LOG  props [object Object]
 LOG  ConnectService retry count: 1 source HelloWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  ConnectService retry count: 1 source AnotherWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 1 times...
 LOG  ConnectService retry count: 2 source HelloWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 2 times...
 LOG  ConnectService retry count: 3 source AnotherWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 3 times...
 LOG  ConnectService retry count: 4 source HelloWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Toast message from connect timeout 4th try: HelloWorldApp.componentDidMount useNew: false  url: todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 4 times...
 LOG  ConnectService retry count: 5 source AnotherWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 5 times...
 LOG  ConnectService retry count: 6 source HelloWorldApp.componentDidMount useNew: false url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: false  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  SHOULD REJECT CALL
 LOG  Connection Failed - error TypeError: Network request failed for url:https://jsonplaceholder.typicode.com/todos/1
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/1
 ERROR  Calling updateUser from AnotherWorldApp.componentDidMount useNew: false error: false
```

# Output for useNew set to true

Here's the output when useNew is set to true, demonstrating the fix:

```
 LOG  ConnectService file is loading... retryCount is 0
 LOG  NewConnectService file is loading...
 LOG  Running "TestScope" with {"rootTag":21}
 LOG  props [object Object]
 LOG  NewConnectService retry count: 1 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  NewConnectService retry count: 1 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 1 times...
 LOG  NewConnectService retry count: 2 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 1 times...
 LOG  NewConnectService retry count: 2 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 2 times...
 LOG  NewConnectService retry count: 3 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 2 times...
 LOG  NewConnectService retry count: 3 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 3 times...
 LOG  NewConnectService retry count: 4 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Toast message from connect timeout 4th try: HelloWorldApp.componentDidMount useNew: true  url: todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 3 times...
 LOG  NewConnectService retry count: 4 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Toast message from connect timeout 4th try: AnotherWorldApp.componentDidMount useNew: true  url: todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 4 times...
 LOG  NewConnectService retry count: 5 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 4 times...
 LOG  NewConnectService retry count: 5 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  Retrying connection 5 times...
 LOG  NewConnectService retry count: 6 source HelloWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/2
 LOG  Attempt fetch from source: HelloWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/2
 LOG  Retrying connection 5 times...
 LOG  NewConnectService retry count: 6 source AnotherWorldApp.componentDidMount useNew: true url: https://jsonplaceholder.typicode.com/todos/1
 LOG  Attempt fetch from source: AnotherWorldApp.componentDidMount useNew: true  at url:  https://jsonplaceholder.typicode.com/todos/1
 LOG  SHOULD REJECT CALL
 LOG  Connection Failed - error TypeError: Network request failed for url:https://jsonplaceholder.typicode.com/todos/2
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/2
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/2
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/2
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/2
 ERROR  Calling updateUser2 from HelloWorldApp.componentDidMount useNew: true error: false
 LOG  SHOULD REJECT CALL
 LOG  Connection Failed - error TypeError: Network request failed for url:https://jsonplaceholder.typicode.com/todos/1
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/1
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/1
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/1
 LOG  Connection Failed - error false for url:https://jsonplaceholder.typicode.com/todos/1
 ERROR  Calling updateUser from AnotherWorldApp.componentDidMount useNew: true error: false
```