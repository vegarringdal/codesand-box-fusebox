const { fusebox, sparky, pluginPostCSS } = require("fuse-box");
const { pluginTypeChecker } = require("fuse-box-typechecker");

class Context {
  isProduction;
  runServer;
  getConfig(prod) {
    return fusebox({
      target: "browser",
      entry: `./src/index.ts`,
      webIndex: {
        template: `./src/index.html`,
        publicPath: "./",
      },
      cache: {
        root: `./.cache/`,
        enabled: !prod,
      },
      watcher: {
        enabled: !prod,
        include: [`./src/`],
        ignored: ["dist"],
      },
      hmr: { plugin: `./src/fuseHmrPlugin.ts` },
      devServer: !prod,
      plugins: [
        pluginPostCSS(/\.css$/, {
          stylesheet: {
            postCSS: {
              plugins: [require("tailwindcss"), require("autoprefixer")],
            },
          },
        }),
        pluginTypeChecker({
          basePath: "./",
          tsConfigOverride: {
            extends: "./tsconfig.json",
            compilerOptions: {
              rootDirs: [`./src`],
            },
            exclude: ["**/__tests__"],
          },
        }),
      ],
    });
  }
}

// commen runner for all samples
async function run(ctx) {
  ctx.runServer = true;

  const fuse = ctx.getConfig(false);
  await fuse.runDev({
    bundles: { distRoot: `./dist/`, app: "app.js" },
  });
}

run(new Context());
