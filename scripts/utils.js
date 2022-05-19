import { execa } from "execa";

function runGit(args, options) {
    args = Array.isArray(args) ? args : [args];
    return execa("git", args, options);
  }

export {
    runGit,
  };
