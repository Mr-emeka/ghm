const scope = packageName.split("/")[1];

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
    commitMessage: `feat(${scope}): released version v${version} [no ci]`,
    requireCommits: true,
    requireCommitsFail: false,
  },
  npm: {
    publish: false,
    versionArgs: ["--workspaces false"],
  },
  github: {
    release: true,
    releaseName: `${packageName}-v${version}`,
  },
  hooks: {
    "before:bump": "turbo build",
    "before:git:release": ["git add --all"],
  },
};
