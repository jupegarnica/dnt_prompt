// import prompts from "npm:prompts";

import { build, type BuildOptions } from "https://deno.land/x/dnt@0.30.0/mod.ts";

import {
  dirname,
  resolve,
} from "https://deno.land/std@0.157.0/path/mod.ts";

// const prompts = await import("npm:prompts");
// localStorage.removeItem("package.json")
const baseDir = resolve(Deno.cwd(), ".");
const saved = JSON.parse(localStorage.getItem("package.json") || "{}");
// console.log(saved);


type Question = {
  type: 'text' | 'list' | 'confirm' | 'number' | 'invisible';
  name: string;
  message: string;
  separator?: string;
  initial?: string;
};

const prompts = (questions: Question[]) => {
  const answers = {} as Record<string, string>;
  for (const question of questions) {
    const answer: string = prompt(question.message, question.initial) || '';
    answers[question.name] = answer;
  }
  return answers;
};






const questions = [
  {
    type: 'text',
    name: "name",
    message: "Package name?",
    initial: saved.name || '',

  },
  {
    type: 'text',
    name: "version",
    message: "Package version?",
    initial: saved.version || '0.0.1',

  },
  {
    type: 'text',
    name: "description",
    message: "Package description?",
    initial: saved.description || '',
  },
  {
    type: 'text',
    name: "license",
    message: "Package license?",
    initial: saved.license || 'MIT',
  },
  {
    type: 'text',
    name: "author",
    message: "Package author?",
    initial: saved.author || '',
  },
  {
    type: 'text',
    name: "email",
    message: "Author email?",
    initial: saved.email || '',
  },
  {
    type: 'text',
    name: "url",
    message: "Author url?",
    initial: saved.url || '',
  },
  {
    type: 'text',
    name: "repo-url",
    message: "Repository url?",
    initial: saved["repo-url"],
  },
  {
    type: 'text',
    name: "bugs-url",
    message: "Bugs url?",
    initial: saved["bugs-url"] || '',
  },
  {
    type: 'text',
    name: "homepage-url",
    message: "Homepage url?",
    initial: saved["homepage-url"] || '',
  },
  {
    type: 'text',
    name: "funding-url",
    message: "Funding url?",
    initial: saved["funding-url"] || '',
  },
  {
    type: 'list',
    separator: ',',
    name: "keywords",
    message: "Keywords?",
    initial: saved.keywords || '',



  },
  {
    type: 'list',
    separator: ',',
    name: "entryPoints",
    message: "entryPoints?",
    initial: saved.entryPoints || "main.ts",
  },
  {
    type: 'list',
    separator: ',',
    name: "copy-files",
    message: "Copy files?",
    initial: saved["copy-files"] || "README.md, LICENSE",
  },
  {
    type: 'text',
    name: "output-dir",
    message: "Output directory?",
    initial: saved["output-dir"] || '.npm',
  },
];

const response = prompts(questions as Question[]);

localStorage.setItem('package.json', JSON.stringify(response));




const entryPoints = response.entryPoints.split(",").map((s) => s.trim());

const buildOptions: BuildOptions = {
  entryPoints: entryPoints.map((e) => resolve(baseDir, e)) || [],
  outDir: resolve(baseDir, response["output-dir"]),
  test: true,
  compilerOptions: {
    sourceMap: true,
  },
  shims: {},
  package: {
    name: response.name,
    version: response.version,
    description: response.description,
    license: response.license,
    sideEffects: false,
    "publishConfig": {
      "access": "public",
    },
    author: {
      name: response.author,
      email: response.email,
      url: response.url,
    },
    repository: {
      type: "git",
      url: response["repo-url"],
    },
    bugs: {
      url: response["bugs-url"],
    },
    homepage: response["homepage-url"],
    funding: {
      type: "patreon",
      url: response["funding-url"],
    },
    keywords: response.keywords,
  },
}


await build(buildOptions);


for (const file of response['files-to-copy']) {



  Deno.copyFileSync(
    resolve(baseDir, file),
    resolve(baseDir, response["output-dir"], file),
  );
}



console.info("Done!");
