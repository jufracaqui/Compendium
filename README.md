# Compendium

Compendium lets you organize scripts and run them from a web interface.

## How to

Scripts should be added in the directory `scripts` inside directories that follow the following structure:

```
compendium
compendium.config.json
scripts
    |_ scriptName1
    |   |_ config.json
    |   |_ scriptName1.osName1
    |   |_ scriptName1.osName2
    |   |_ scriptName1
    |_ scriptName2
        |_ config.json
        |_ scriptName2.osName1
        |_ scriptName2.osName2
        |_ scriptName2
```

## compendium.config.json
```json
{
    "OSs": [
        "mac",
        "fedora"
    ],
    "preferedOs": "mac",
    "terminals": [
        "bash",
        "zsh"
    ],
    "preferedTerminal": "bash"
}
```

## scripts
### config.json
Must be like the folowing

```json
{
    "tab": "Tab Name",
    "name": "Script Name",
    "description": "Description about the script",
    "author": "Author Name"
}
```

### script
A script may not be compatible with multiple OSs, so we can add a working one for each OS we need, adding the OS after de script's name. In case there's no OS in the name or our prefered OS has no script, the script with no OS is run by default.