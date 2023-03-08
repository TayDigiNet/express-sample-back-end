import fs from "fs";

export default function readValueJsonFile(path: string) {
  const file = fs.readFileSync(path).toString();
  const data = JSON.parse(file);
  return data;
}
