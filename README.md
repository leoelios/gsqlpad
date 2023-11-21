# Global SQLPAD

Globlify access to multiple SQLPAD instances into a unique command-line interface.

## todo

- compress using gzip (pkg)

## user docs

- [User documentation](./docs/index.md)

## Requirements

- NodeJS >= v18.15.0

## Building and making binary executables

### macos

```
tsc && \
yarn pkg . && \
bin/gsqlpad-node18-macos
```

binary's generated at `bin/` directory, check this out, select your CPU architecture and execute this
