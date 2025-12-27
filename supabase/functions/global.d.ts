// This file is a fallback to silence IDE errors if the Deno extension is not installed.
// It declares the global Deno namespace so TypeScript doesn't complain.

declare const Deno: {
    env: {
        get(key: string): string | undefined;
        toObject(): { [key: string]: string };
    };
    serve(handler: (req: Request) => Promise<Response> | Response): void;
};

declare module "https://*";
