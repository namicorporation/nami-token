/**
 * Do NOT allow using `npm` as package manager.
 */
if (process.env.npm_execpath.indexOf('npm') === -1) {
    console.error('\x1b[30m\x1b[103mYou must use NPM to install dependencies:\x1b[0m');
    console.error('\x1b[30m\x1b[103m  $ npm install\x1b[0m');
    process.exit(1);
}
