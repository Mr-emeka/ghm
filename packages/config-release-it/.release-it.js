const version = '${version}';
const fs = require('fs');
const path = require('path');
const { release } = require('process');

// Read package.json to get the package name
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
const packageName = packageJson.name;
const scope = packageName.split("/")[1];
console.log(packageJson, packageName)


module.exports = {
  plugins: {
    "@release-it/conventional-changelog": {
      path: ".",
      infile: "CHANGELOG.md",
      preset: "conventionalcommits",
      types: [
        {
          type: "feat",
          section: "Features",
        },
        {
          type: "fix",
          section: "Bug Fixes",
        },
        {
          type: "cleanup",
          section: "Cleanup",
        },
        {
          type: "docs",
          section: "Documentations",
        },
      ],
      gitRawCommitsOpts: {
        path: ".",
      },
    },
    "@release-it/bumper": {
      in: "package.json", // using arbitrary json file to hold the version instead
      out: "package.json",
    },
  },
  git: {
    push: true,
    tagName: `${packageName}-v${version}`,
    pushRepo: "git@github.com:mr-emeka/ghm.git",
    commitsPath: ".",
    commitMessage: ` chore(${scope}): released version v${version} [no ci]`,
    requireCommits: true,
    requireCommitsFail: false,
  },
  npm: {
    publish: false,
    release: false
  },
  github: {
    release: true,
    releaseName: `${packageName}-v${version}`,
  },
  hooks: {
    "before:git:release": ["git add --all"],
  },
};
