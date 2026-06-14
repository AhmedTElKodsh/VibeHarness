import { resolve } from "node:path";
import { writeStarterProject } from "./fixtures";

export function initProject(target: string, overwrite = false): string {
  const root = resolve(target);
  writeStarterProject(root, overwrite);
  return root;
}
