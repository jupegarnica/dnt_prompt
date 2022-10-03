import { build, emptyDir } from "https://deno.land/x/dnt@0.30.0/mod.ts";
import prompt_object from "https://deno.land/x/prompt_object@v1.0.4/prompt_object.ts"


import { deepMerge } from "https://deno.land/std/collections/deep_merge.ts";

import {
  resolve,
} from "https://deno.land/std@0.157.0/path/mod.ts";


if (Deno.args.includes('--remove-saved')) localStorage.removeItem("package.json");

const baseDir = resolve(Deno.cwd(), ".");
const saved = JSON.parse(localStorage.getItem("package.json") || "{}");
// console.log(saved);


const defaultOptions = {
  entryPoints: ['mod.ts', 'main.ts'],
  outDir: resolve(baseDir, '.npm'),
  test: true,
  typeCheck: true,
  declaration: false,
  scriptModule: false,
  compilerOptions: {
    sourceMap: true,
  },
  shims: {
    deno: true,
    prompts: false,
    timers: false,
    blob: false,
    crypto: false,
    domException: true,
    undici: false,
    weakRef: false,
    webSocket: false,

  },
  package: {
    name: '',
    version: '0.0.0',
    description: '',
    license: 'MIT',
    sideEffects: false,
    publishConfig: {
      "access": "public",
    },
    author: {
      name: '',
      email: '',
      url: '',
    },
    repository: {
      type: "git",
      url: 'http://github.com/...',
    },
    bugs: {
      url: 'http://github.com/.../bugs',
    },
    homepage:
      'https://deno.land/x/...',
    funding: {
      type: "patreon",
      url: "https://www.patreon.com/...",
    },
    keywords: ['deno', 'deno.land', 'deno.land/x'],
  },
}



const files = {
  "files-to-copy": ['README.md', 'LICENSE', 'VERSION'],
}
const defaults = deepMerge(deepMerge(defaultOptions, files), saved)

const options = prompt_object(defaults);

localStorage.setItem('package.json', JSON.stringify(options));



try {

  await emptyDir(options.outDir);
  await build(options);

  for (const file of options['files-to-copy']) {
    Deno.copyFileSync(
      resolve(baseDir, file),
      resolve(baseDir, options["outDir"], file),
    );
  }

  console.info("Done!");


} catch (error) {
  console.error(error);
  console.error("Failed to build");
  console.error("Read dnt docs for more info: https://deno.land/x/dnt");
  Deno.exit(1);


}
