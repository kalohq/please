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
npm install --global please
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

please makes it super simple to write and manage project scripts and your day-to-day command line tricks.

When we say “simple”, we really mean it. Write your scripts as plain old executable files – be it in bash, python, JavaScript or any other language of choice. Put them in a `scripts/` directory in your project root.

Now, whenever you run `please <script name>`, we’ll politely run `scripts/<script name>` for you.




<a id="/goodies"></a>&nbsp;

## GOODIES

#### script arguments

As opposed to many other script runners, please makes it super easy to pass arguments to scripts. We’ll pass them over to the executable just as you’d expect.

So, when you run `please build --mode=dev --target='release v3.0.0'`, we’ll spawn `scripts/build --mode=dev --target='release v3.0.0'`.

#### composable script base

please looks for any script recursively. When you call `please help`, we’ll try running `./scripts/help`. If there’s no executable file there, we’ll have a go at `../scripts/help`. We keep going upwards until we find it for you.

This makes it really easy for you to organize scripts in a natural way. For instance, as well as project-specific scripts, you can have a personal collection of command-line tricks at `/home/<you>/scripts/`.

#### overview

When you run `please` without any arguments, we’ll print a list of all available scripts. Just for your convenience.

#### script docs

Gone are the days of undocumented builds. The effortless handling of arguments makes it really easy for you to add a `--help` option to any please script. Feel free to make it print a one-liner description – or a full-blown, manpage-like overview of workflows and options.

Believe it or not – once we’ve started documenting our own scripts with `--help`, we never want to look back.

#### portability

please scripts are just executable files. You might have noticed this already, but you can run them on a friend’s computer without installing please. Just run `scripts/start` instead of `please start`.

As well as that, because each of your scripts defines its interpreter explicitly through the [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29), you can use them in any shell.

One more note. please is so simple, that it doesn’t need any configuration. No more “weird, it works on my laptop” problems.




<a id="/options"></a>&nbsp;

## OPTIONS

#### `<script name>`
If you pass a script name, we’ll execute `scripts/<script name>` for you.

#### `[...args]`
If you pass any args, we’ll pass them over to your script.

#### `--help`
You’re looking at it.




<a id="/gotchas"></a>&nbsp;

## GOTCHAS

At the moment, it’s most convenient if you save scripts without without a file name extension (i. e. `scripts/run` rather than `scripts/run.sh`). If it’s a problem for you, [drop us a line](https://git.io/please.issues).

For future compatibility, make sure your script names don’t begin with a dash (`-`). Unsurprisingly, `please --help` will **not** run `scripts/--help`.

Windows support isn’t there just yet. It’s perfectly possible though. So if you need it, don’t hesitate to [give us a shout](https://git.io/please.issues).




<a id="/credits"></a>&nbsp;

## CREDITS

Many thanks to Lisa Krymova for the elegant bowtie icon in our logo.

Many thanks to Catharsis Fonts for the amazing [open-source font](https://www.behance.net/gallery/28579883/Cormorant-an-open-source-display-font-family) we’ve used in the wordmark.




<a id="/license"></a>&nbsp;

## LICENSE

[MIT](https://git.io/please.license) © [Lystable](https://github.com/lystable)
