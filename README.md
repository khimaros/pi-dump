# pi-dump

request dumping extension for [pi.dev](https://pi.dev).

adds a `--dump` flag which prints the complete provider request as JSON to
stdout and exits before the model is called.

useful for inspecting exactly what pi sends to the LLM: the assembled
system prompt, context files, skills, tool definitions, conversation
history, the current user message, and the request options.

no tokens are spent, since the process exits before the request goes out.

## getting started

prerequisites:

- node.js 20+
- a working pi installation

install directly from git:

```bash
pi install git:github.com/khimaros/pi-dump
```

or from a local source checkout:

```bash
git clone https://github.com/khimaros/pi-dump
pi install ./pi-dump
```

`pi update --extension` refreshes git and npm installs in place.

## usage

```bash
pi --dump -p 'hello'
```

the dump goes to stdout and everything else goes to stderr, so it can be
redirected straight to a file:

```bash
pi --dump -p 'hello' > request.json
```

inspect it with `jq`:

```bash
jq '.tools[] .function .name' request.json
```

without `--dump`, the extension does nothing.

## how it works

the extension listens for `before_provider_request`, which fires once the
provider payload is fully assembled and immediately before it is sent. it
writes the payload to raw file descriptor 1, bypassing pi's redirection of
`process.stdout` to stderr, then exits.

```
src/
  extension/   pi extension entry (.ts) -- registers the --dump flag and the
               before_provider_request listener
```

pi loads `src/extension/index.ts` straight from source through its bundled
jiti loader, so there is no build step.

## license

GPL-3.0-or-later
