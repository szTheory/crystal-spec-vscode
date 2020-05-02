export default function toSpecPath(filePath: string, pattern: string): string {
  let [first, ...rest] = filePath.split("/");

  if (filePath.indexOf(`_${pattern}.cr`) > -1 || first === pattern) {
    return filePath;
  } else {
    let middle = rest.slice(0, rest.length - 1);
    let filename = rest[rest.length - 1];
    return [pattern, ...middle, filename.replace(".cr", `_${pattern}.cr`)].join("/");
  }
}
