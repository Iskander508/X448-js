# X448-js [![GitHub license](https://img.shields.io/github/license/Iskander508/X448-js?style=flat)](https://github.com/Iskander508/X448-js/blob/master/LICENSE) [![Tests](https://github.com/Iskander508/X448-js/workflows/CI/badge.svg)](https://github.com/Iskander508/X448-js/actions) ![npm](https://img.shields.io/npm/v/x448-js) [![Coverage Status][coveralls-img]][coveralls-url] [![Monthly Downloads][downloads-img]][downloads-url]

[coveralls-url]: https://coveralls.io/github/Iskander508/X448-js?branch=master
[coveralls-img]: https://coveralls.io/repos/Iskander508/X448-js/badge.svg?branch=master&service=github
[downloads-url]: https://www.npmjs.com/package/x448-js
[downloads-img]: https://img.shields.io/npm/dm/x448-js.svg

Pure JavaScript/TypeScript implementation of the X448 elliptic curve (RFC 7748) for ECDH key exchange. Uses the `jsbn` library for big integer operations.

## Installation

Using `npm`:

    npm install x448-js

or `yarn`:

    yarn add x448-js

Then include it in your code:

```ts
import { getPublicKey, getSharedSecret } from "x448-js";
```

## Usage

### `getPublicKey(privateKey)`

Calculate public key from a provided private key

```ts
const privateKey = crypto.randomFillSync(new Uint8Array(56));
const publicKey = getPublicKey(privateKey);
```

The private key can be any random generated Buffer/byte-array of length 56

### `getSharedSecret(privateKey, publicKey)`

Calculate shared secret from a locally stored private key and a remote public key

The results are represented as plain number arrays. They can be converted using `Buffer.from`, or `Uint8Array.from`.

## Example

ECDH shared secret exchange

```ts
const alice_private = random(56); // 9a8f4925d1519f5775cf46b04b5800d4ee9ee8bae8bc5565d498c28dd9c9baf574a9419744897391006382a6f127ab1d9ac2d8c0a598726b
const bob_private = random(56); // 1c306a7ac2a0e2e0990b294470cba339e6453772b075811d8fad0d1d6927c120bb5ee8972b0d3e21374c9c921b09d1b0366f10b65173992d

const alice_public = getPublicKey(alice_private); // 9b08f7cc31b7e3e67d22d5aea121074a273bd2b83de09c63faa73d2c22c5d9bbc836647241d953d40c5b12da88120d53177f80e532c41fa0
const bob_public = getPublicKey(bob_private); // 3eb7a829b0cd20f5bcfc0b599b6feccf6da4627107bdb0d4f345b43027d8b972fc3e34fb4232a13ca706dcb57aec3dae07bdc1c67bf33609

const alice_shared_secret = getSharedSecret(alice_private, bob_public); // 07fff4181ac6cc95ec1c16a94a0f74d12da232ce40a77552281d282bb60c0b56fd2464c335543936521c24403085d59a449a5037514a879d
const bob_shared_secret = getSharedSecret(bob_private, alice_public); // 07fff4181ac6cc95ec1c16a94a0f74d12da232ce40a77552281d282bb60c0b56fd2464c335543936521c24403085d59a449a5037514a879d
```
