# Crystal Spec VSCode

This extension provides basic commands for running spec files through the built-in VSCode terminal.

## Features

Available commands:

```json
[
  {
    "command": "extension.runFileSpecs",
    "title": "Run File Specs",
    "key": "cmd+shift+t"
  },
  {
    "command": "extension.runSpecLine",
    "title": "Run Spec Line",
    "key": "cmd+l"
  },
  {
    "command": "extension.runLastSpec",
    "title": "Run Last Spec",
    "key": "cmd+y"
  }
]
```

### Sidebar Option

There is an option to run any `file` or `folder` specs from sidebar.
**Right click** an folder or spec file and choose `Run Specs` option.

### Infer Spec Files

There is posibility to run specs for currently open file,
the extension will try to guess the path using Rails convention:

`src/actions/test_action.cr => spec/actions/test_action_spec.cr`.

## Extension Settings

This extension contributes the following settings:

```json
"crystal.specCommand": {
    "type": "string",
    "default": "",
    "description": "Defines a custom command to run for specs"
},
"crystal.specFocusTerminal": {
    "type": "boolean",
    "default": true,
    "description": "Defines if it should focus on terminal on each spec run"
},
"crystal.specClearTerminal": {
    "type": "boolean",
    "default": true,
    "description": "Defines if it should clear the terminal on each spec run"
},
"crystal.specSaveFile": {
    "type":"boolean",
    "default": false,
    "description": "Auto Save file before running spec test"
}
```
