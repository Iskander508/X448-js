import { getPublicKey, getSharedSecret } from "./";

function random(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 256));
}

describe("X448", () => {
  it("matches shared secret for 2 generated key pairs", () => {
    const a_priv = random(56);
    const b_priv = random(56);

    const a_pub = getPublicKey(a_priv);
    const b_pub = getPublicKey(b_priv);

    const k_ab = getSharedSecret(a_priv, b_pub);
    const k_ba = getSharedSecret(b_priv, a_pub);

    expect(k_ab).toEqual(k_ba);
  });

  // https://tools.ietf.org/html/rfc7748#section-6.2
  it("matches example from RFC", () => {
    const a_priv = Array.from(
      Buffer.from(
        "9a8f4925d1519f5775cf46b04b5800d4ee9ee8bae8bc5565d498c28dd9c9baf574a9419744897391006382a6f127ab1d9ac2d8c0a598726b",
        "hex",
      ),
    );
    const b_priv = Array.from(
      Buffer.from(
        "1c306a7ac2a0e2e0990b294470cba339e6453772b075811d8fad0d1d6927c120bb5ee8972b0d3e21374c9c921b09d1b0366f10b65173992d",
        "hex",
      ),
    );

    const a_pub = getPublicKey(a_priv);
    const b_pub = getPublicKey(b_priv);

    expect(a_pub).toEqual(
      Array.from(
        Buffer.from(
          "9b08f7cc31b7e3e67d22d5aea121074a273bd2b83de09c63faa73d2c22c5d9bbc836647241d953d40c5b12da88120d53177f80e532c41fa0",
          "hex",
        ),
      ),
    );

    expect(b_pub).toEqual(
      Array.from(
        Buffer.from(
          "3eb7a829b0cd20f5bcfc0b599b6feccf6da4627107bdb0d4f345b43027d8b972fc3e34fb4232a13ca706dcb57aec3dae07bdc1c67bf33609",
          "hex",
        ),
      ),
    );

    const k_ab = getSharedSecret(a_priv, b_pub);
    const k_ba = getSharedSecret(b_priv, a_pub);
    expect(k_ab).toEqual(k_ba);
    expect(k_ab).toEqual(
      Array.from(
        Buffer.from(
          "07fff4181ac6cc95ec1c16a94a0f74d12da232ce40a77552281d282bb60c0b56fd2464c335543936521c24403085d59a449a5037514a879d",
          "hex",
        ),
      ),
    );
  });

  it("fails with missing input", () => {
    const missing = (null as unknown) as Buffer;
    expect(() => getPublicKey(missing)).toThrow();
    expect(() => getSharedSecret(missing, random(56))).toThrow();
    expect(() => getSharedSecret(random(56), missing)).toThrow();
  });

  it("fails with invalid size of input", () => {
    expect(() => getPublicKey(random(57))).toThrow();
    expect(() => getPublicKey(random(55))).toThrow();
    expect(() => getSharedSecret(random(56), random(55))).toThrow();
    expect(() => getSharedSecret(random(55), random(56))).toThrow();
  });

  // https://tools.ietf.org/html/rfc7748#section-6.2
  // As with X25519, both sides MAY check, without leaking extra
  //  information about the value of K, whether the resulting shared K is
  //  the all-zero value and abort if so.
  it("fails with invalid public key", () => {
    const invalidPublicKey = Array.from({ length: 56 }, () => 0);
    expect(() => getSharedSecret(random(56), invalidPublicKey)).toThrow();
  });
});
