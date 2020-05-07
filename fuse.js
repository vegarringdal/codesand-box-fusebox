const { fusebox, sparky, pluginPostCSS } = require("fuse-box");
const { pluginTypeChecker } = require("fuse-box-typechecker");

let Context = {
  getConfig: function (prod) {
    return fusebox({
      target: "browser",
      entry: `./src/index.ts`,
      webIndex: {
        template: `./src/index.html`,
      },
      hmr: { plugin: `./src/fuseHmrPlugin.ts` },
      devServer:true,
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
          },
        }),
      ],
    });
  },
};

// commen runner for all samples
async function run(ctx) {
  ctx.runServer = true;

  const fuse = ctx.getConfig(false);
  await fuse.runDev({
    bundles: { distRoot: `./dist/`, app: "app.js" },
  });
}

run(Context);
