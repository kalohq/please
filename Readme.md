[![Travis – build status
](https://img.shields.io/travis/lystable/please/master.svg?style=flat-square
)](https://travis-ci.org/lystable/please
) [![Coveralls – test coverage
](https://img.shields.io/coveralls/lystable/please.svg?style=flat-square
)](https://coveralls.io/r/lystable/please
) [![David – status of dependencies
](https://img.shields.io/david/lystable/please.svg?style=flat-square
)](https://david-dm.org/lystable/please
) [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square
)](https://github.com/airbnb/javascript
)




<a id="/"></a>&nbsp;

<h1 align="center">
  <img
    src="https://cdn.rawgit.com/lystable/please/4de9c1f/logo.svg"
    width="400"
    height="285"
    alt="please – the polite script runner"
  />
</h1>




<a id="/installation"></a>&nbsp;

## INSTALLATION

```sh
npm install --global please-runner
# or
yarn global add please-runner
```




<a id="/synopsis"></a>&nbsp;

## SYNOPSIS

```sh
please  
please <script name> [...args]  
please --help
```




<a id="/description"></a>&nbsp;

## DESCRIPTION

please makes it super simple to write and manage project scripts.

When we say “simple”, we really mean it. Write your scripts as plain old executable files – be it in bash, python, JavaScript or any other language of choice. Put them in a `scripts/` directory in your project root.

Now, whenever you run `please <script name>`, we’ll politely run `scripts/<script name>` for you.




<a id="/options"></a>&nbsp;

## OPTIONS

#### `<script name>`
We’ll execute `scripts/<script name>` for you.

#### `[...args]`
We’ll pass any args over to your script.

#### `--help`
You’re looking at it.

#### `--version`
Prints the version number and exits.




<a id="/goodies"></a>&nbsp;

## GOODIES

#### script arguments

As opposed to many other script runners, please makes it super easy to pass arguments to scripts. We’ll pass them over to the executable just as you’d expect.

So, when you run `please build --mode=dev --target='release v3.0.0'`, we’ll spawn `scripts/build --mode=dev --target='release v3.0.0'`.

#### overview

When you run `please` without any arguments, we’ll print a list of all available scripts. Just for your convenience.

#### script summaries

Ever felt lost in a project, not knowing if there’s a script for what you want to do? With please, no-one will ever feel lost again! Just add a one-liner summary to your script, right below the shebang. please will politely show that summary whenever it lists available scripts.

Gone are the days of undocumented builds!

#### script docs

One-liner summary doesn’t cut it? Worry not! The effortless handling of arguments makes it really easy for you to add a `--help` option to any please script. Feel free to make it print a one-liner description – or a full-blown, manpage-like overview of workflows and options.

Believe it or not – once we’ve started documenting our own scripts with `--help`, we never want to look back.

#### recursive discovery

You don’t need to be in the root directory of your project to access a please script. If please doesn’t find a `scripts/` subdirectory in your current working directory, it will go up your directory tree, looking for your scripts.

So instead of getting out of your way to type `cd ../../..; please make things happen` or `../../../scripts/make things happen`, you can just call `please make things happen`. please will take care of finding that script for you so you can stay focused on what you’re doing.

#### monorepo-friendly

If you’re looking after a monorepo, apart from project-wide scripts in the root directory you might need package-wide scripts in subdirectories. Normally, please stops looking for scripts as soon as it finds a `scripts/` directory. You can change that though if you want please to access both package-wide scripts and project-wide scripts from the package directory. Just add a `.pleaserc` file to your package directory and set the `subproject` property to `true` with JSON or YAML:

```yaml
subproject:
  true
```

Boom! We have you covered.

#### portability

please scripts are just executable files. You might have noticed this already, but you can run them on a friend’s computer without installing please. Just run `scripts/start` instead of `please start`.

As well as that, because each of your scripts defines its interpreter explicitly through the [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29), you can use them in any shell.

One more note. please is so simple, that it doesn’t need any configuration. No more “weird, it works on my laptop” problems.




<a id="/gotchas"></a>&nbsp;

## GOTCHAS

At the moment, it’s most convenient if you save scripts without without a file name extension (i. e. `scripts/run` rather than `scripts/run.sh`). If it’s a problem for you, [drop us a line](https://git.io/please.issues).

For future compatibility, make sure your script names don’t begin with a dash (`-`). Unsurprisingly, `please --help` will **not** run `scripts/--help`.

Windows support isn’t there just yet. It’s perfectly possible though. So if you need it, don’t hesitate to [give us a shout](https://git.io/please.issues).

Script summaries currently only work with scripts written in sh, bash, python and javascript. [Let us know](https://git.io/please.issues) if you’d like us to support other languages.




<a id="/credits"></a>&nbsp;

## CREDITS

Many thanks to Lisa Krymova for the elegant bowtie icon in our logo.

Many thanks to Catharsis Fonts for the amazing [open-source font](https://www.behance.net/gallery/28579883/Cormorant-an-open-source-display-font-family) we’ve used in the wordmark.




<a id="/license"></a>&nbsp;

## LICENSE

[MIT](https://git.io/please.license) © [Kalo](https://github.com/kalohq)
