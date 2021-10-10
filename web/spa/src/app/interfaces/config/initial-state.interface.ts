import { Config } from "./config.interface";
import { Script } from "../scripts/script.interface";

export interface InitialState {
  scripts: Script[],
  config: Config
}
