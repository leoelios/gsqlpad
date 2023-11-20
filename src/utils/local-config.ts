import fs from "fs";
import os from "os";
import path from "path";
import Session from "../types/session";

const HOME_DIR = os.homedir();
const CONFIG_DIRECTORY = path.join(HOME_DIR, ".gsqlpad");
const CONFIG_FILE = path.join(CONFIG_DIRECTORY, "config.json");

interface Instance {
  identifier: string;
  instance: string;
  user: string;
  password: string;
  session: Session;
}

interface Config {
  instances: Array<Instance>;
}

export function saveInstance(instance: Instance) {
  initializeConfigDirectoryIfNecessary();

  addInstanceToLocalConfig(instance);
}

function initializeConfigDirectoryIfNecessary() {
  if (!fs.existsSync(CONFIG_DIRECTORY)) {
    fs.mkdirSync(CONFIG_DIRECTORY);
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    initializeConfigFile();
    console.log("\n🟢 $HOME/.gsqlpad/config.json initialized");
  }
}

function addInstanceToLocalConfig(instance: Instance) {
  const config = getConfig();

  config.instances.push(instance);

  saveConfigToFile(config);

  console.log("\n\n🟢 Instance config saved locally successfully.");
}

function getConfig(): Config {
  const content = fs.readFileSync(CONFIG_FILE, "utf-8");

  return JSON.parse(content);
}

function initializeConfigFile() {
  const config: Config = {
    instances: [],
  };

  saveConfigToFile(config);
}

function saveConfigToFile(config: Config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config), "utf8");
}
