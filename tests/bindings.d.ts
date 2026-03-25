export {};

declare global {
  const __STATIC_CONTENT__: KVNamespace;
  const __STATIC_CONTENT_MANIFEST__: string;
}

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
