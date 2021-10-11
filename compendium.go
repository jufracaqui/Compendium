package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"strings"

	"github.com/zserge/lorca"
)

const scriptsPath = "./scripts"
const configPath = "./configs"
const windowWidth = 450
const windowHeight = 800

var fs embed.FS
var userConfig UserConfig

// InitialState stores the scripts and the config for the app
type InitialState struct {
	Scripts []Script   `json:"scripts"`
	Config  UserConfig `json:"config"`
}

// UserConfig stores data the user can modify
type UserConfig struct {
	OSs              []string `json:"OSs"`
	PreferedOS       string   `json:"preferedOs"`
	Terminals        []string `json:"terminals"`
	Preferedterminal string   `json:"preferedTerminal"`
}

// Script represents a script the user can run
type Script struct {
	Config ScriptConfig `json:"config"`
	Dir    string       `json:"dir"`
}

// ScriptConfig represents the data from which we can differenciate scripts
type ScriptConfig struct {
	Tab         string `json:"tab"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Author      string `json:"author"`
}

func main() {
	config := readConfig()
	// If no config create a default one
	if config.PreferedOS == "" {
		config = UserConfig{
			OSs:              []string{"mac", "fedora"},
			PreferedOS:       "mac",
			Terminals:        []string{"bash", "zsh"},
			Preferedterminal: "bash",
		}
	}

	// Accessible from all compendium
	userConfig = config

	var initialState InitialState
	initialState.Scripts = listScripts()
	initialState.Config = config

	// initialState has to be sent as a string for the SPA
	jsonString, err := json.Marshal(initialState)
	if err != nil {
		fmt.Println(err)
	}

	runUI(string(jsonString))
}

// readConfig gets the user config for the app in the case one exists
func readConfig() UserConfig {
	jsonFile, err := os.Open(configPath + "/compendium.config.json")
	if err != nil {
		return UserConfig{}
	}
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		fmt.Println(err)
	}

	var config UserConfig

	err = json.Unmarshal(byteValue, &config)
	if err != nil {
		fmt.Println(err)
	}

	return config
}

// listScripts runs through all directories in scripts and reads data from them to add it to the initialState
func listScripts() []Script {
	if _, err := os.Stat(scriptsPath); os.IsNotExist(err) {
		err = os.Mkdir(scriptsPath, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}
	}

	files, err := ioutil.ReadDir(scriptsPath)
	if err != nil {
		log.Fatal(err)
	}

	scripts := make([]Script, 0)
	for _, f := range files {
		if strings.HasPrefix(f.Name(), ".") {
			continue
		}
		if !f.IsDir() {
			continue
		}
		s := calculateScript(scriptsPath + "/" + f.Name())
		scripts = append(scripts, s)
	}

	return scripts
}

// calculateScript runs on a directory and checks the config for a script
func calculateScript(dirname string) Script {
	f, err := os.Open(dirname)
	if err != nil {
		log.Fatal(err)
	}

	jsonFile, err := os.Open(dirname + "/config.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		fmt.Println(err)
	}

	var config ScriptConfig
	err = json.Unmarshal(byteValue, &config)
	if err != nil {
		fmt.Println(err)
	}

	var script Script
	script.Config = config
	script.Dir = f.Name()

	return script
}

// runUI starts Lorca, sets the initialState in the SPA and creates the bindings for JS functions
func runUI(initialState string) {
	args := []string{}
	if runtime.GOOS == "linux" {
		args = append(args, "--class=Lorca")
	}
	ui, err := lorca.New("", "", windowWidth, windowHeight, args...)
	if err != nil {
		log.Fatal(err)
	}
	defer ui.Close()

	// JS bindings
	ui.Bind("start", uiStart)
	ui.Bind("updateConfig", updateConfig)
	ui.Bind("runScript", runScript)

	// Web server
	http.Handle("/", http.FileServer(http.Dir("./web/dist")))
	go http.ListenAndServe(":8008", nil)
	ui.Load("http://127.0.0.1:8008/")

	// Set initial state in SPA
	ui.Eval(fmt.Sprintf(`window.initialState = JSON.parse('%s')`, initialState))

	// Listen for window close
	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)
	select {
	case <-sigc:
	case <-ui.Done():
	}
}

/*
* -----------------
* BEGIN JS BINDINGS
* -----------------
 */
func uiStart() {
	fmt.Println("UI is ready!")
}

func updateConfig(config UserConfig) {
	file, err := json.MarshalIndent(config, "", " ")
	if err != nil {
		fmt.Println("Error while parsing new config")
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		err = os.Mkdir(configPath, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}
	}

	err = ioutil.WriteFile(configPath+"/compendium.config.json", file, 0644)
	if err != nil {
		fmt.Println("Error while saving config")
	}

	userConfig = config
}

func runScript(script Script) {
	scriptName := strings.Split(script.Dir, "/")[2]
	osName := userConfig.PreferedOS

	filePath := script.Dir + "/" + scriptName + "." + osName
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		filePath = script.Dir + "/" + scriptName
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			fmt.Println("No script found to be run in directory " + script.Dir)
			return
		}
	}
	executeFile(filePath)
}

/*
* ---------------
* END JS BINDINGS
* ---------------
 */

// executeFile runs an executable file in a terminal
func executeFile(filePath string) {
	cmd := exec.Command(userConfig.Preferedterminal, filePath)
	cmd.Stdout = os.Stdout
	cmd.Stdin = os.Stdin
	cmd.Stderr = os.Stderr
	cmd.Run()
}
