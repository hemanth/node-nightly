# node-nightly

## Install

```
$ npm install --global node-nightly
```


## Usage

__For the first time:__

```sh 
$ node-nightly 
Downloading the nightly version, hang on...


node-nightly is avalible on CLI!
```

__And then:__

```sh
$ node-nightly --inspect --debug-brk index.js
Debugger listening on port 9229.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@521e5b7e2b7cc66b4006a8a54cb9c4e57494a5ef/inspector.html?experiments=true&v8only=true&ws=localhost:9229/node
Debugger attached.
Waiting for the debugger to disconnect...
```

__GIF FTW!__

![node-nightly](./node-nightly.gif)


## License

MIT © [Hemanth.HM](https://h3manth.com)
