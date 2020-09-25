# VEGA

## To use the chrome extension do the following:
1. Download and extract zip of repository.
2. Go to chrome://extensions/ and click 'Load unpacked' from the buttons at the top.
3. Select the 'chrome assistant' folder and you're ready to use the extension.


## Creating a New Recording
1. Click the VEGA chrome extension icon to open the popup
2. Select 'New Recording'
3. Title your recording
4. For each item you wish to record do the following:
    - Navigate to the desired webpage
    - Mouse over the element that needs to be interacted with.
    - Press 'Ctrl + q' to open the recording menu
    - Give your item a title and description, then click save.
5. When you are done, click the VEGA chrome extension icon and click 'Finish Recording'.

# Tutorial Creator (Apollo)

A command line interface for students to load a tutorial file and go through the tutorial.
Integrate with this [chrome plugin](https://github.com/aaachen/chrome-assistant)

### Installation

```bash
chmod +x install.sh
./install.sh
```

### Configuring Server

If `tutservd.json` does not specify the path for `tutorial-home`, server would look for tutorials stored at the path `$TUTORIAL_HOME/tutorials`

### Using apollo client

apollo client expects the server to run at localhost and the port specified in `tutservd.json`

```bash
$ apollo 

Usage: <main class> [command] [command options]
  Commands:
    load      load an existing tutorial file
      Usage: load [options] JSON tutorial file
        Options:
          -h, --help


    start      null
      Usage: start [options]
        Options:
          -h, --help


    next      null
      Usage: next [options]
        Options:
          -h, --help


    perform      null
      Usage: perform [options]
        Options:
          -h, --help

```
 
