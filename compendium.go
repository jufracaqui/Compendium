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

var fs embed.FS
var userConfig UserConfig

type InitialState struct {
	Scripts []Script   `json:"scripts"`
	Config  UserConfig `json:"config"`
}

type UserConfig struct {
	OSs              []string `json:"OSs"`
	PreferedOS       string   `json:"preferedOs"`
	Terminals        []string `json:"terminals"`
	Preferedterminal string   `json:"preferedTerminal"`
}

type Script struct {
	Config ScriptConfig `json:"config"`
	Dir    string       `json:"dir"`
}

type ScriptConfig struct {
	Tab         string `json:"tab"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Author      string `json:"author"`
}

func main() {
	var initialState InitialState

	initialState.Scripts = listScripts()

	config := readConfig()
	if config.PreferedOS == "" {
		config = UserConfig{
			OSs:              []string{"mac", "fedora"},
			PreferedOS:       "mac",
			Terminals:        []string{"bash", "zsh"},
			Preferedterminal: "bash",
		}
	}

	userConfig = config
	initialState.Config = config
	jsonString, err := json.Marshal(initialState)
	if err != nil {
		fmt.Println(err)
	}

	runUI(string(jsonString))
}

func executeFile(filePath string) {
	cmd := exec.Command(userConfig.Preferedterminal, filePath)
	cmd.Stdout = os.Stdout
	cmd.Stdin = os.Stdin
	cmd.Stderr = os.Stderr
	cmd.Run()
}

func listScripts() []Script {
	files, err := ioutil.ReadDir(scriptsPath)
	if err != nil {
		log.Fatal(err)
	}

	scripts := make([]Script, 0)
	for _, f := range files {
		s := calculateScript(scriptsPath + "/" + f.Name())
		scripts = append(scripts, s)
	}

	return scripts
}

func calculateScript(dirname string) Script {
	f, err := os.Open(dirname)
	if err != nil {
		log.Fatal(err)
	}

	var script Script

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

	script.Config = config

	script.Dir = f.Name()
	return script
}

func runUI(initialState string) {
	args := []string{}
	if runtime.GOOS == "linux" {
		args = append(args, "--class=Lorca")
	}
	ui, err := lorca.New("", "", 450, 800, args...)
	if err != nil {
		log.Fatal(err)
	}
	defer ui.Close()

	ui.Bind("start", func() {
		fmt.Println("UI is ready!")
	})

	ui.Bind("updateConfig", func(config UserConfig) {

	})
	ui.Bind("runScript", func(script Script) {
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
	})

	http.Handle("/", http.FileServer(http.Dir("./www")))
	go http.ListenAndServe(":8008", nil)
	ui.Load("http://127.0.0.1:8008/")

	ui.Eval(fmt.Sprintf(`window.initialState = JSON.parse('%s')`, initialState))

	sigc := make(chan os.Signal)
	signal.Notify(sigc, os.Interrupt)
	select {
	case <-sigc:
	case <-ui.Done():
	}

	log.Println("exiting...")
}

func readConfig() UserConfig {
	jsonFile, err := os.Open("./compendium.config.json")
	if err != nil {
		fmt.Println(err)
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
