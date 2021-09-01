const args: string[] = Deno.args;
const inputFile: string = args[0];
const inputBinding: string = args[1];

let input: string = await Deno.readTextFile(inputFile);
const binding: string = await Deno.readTextFile(`bindings/${inputBinding}`);
const typeBinding: string = await Deno.readTextFile(`bindings/${inputBinding}.types`);

const bindings: string[] = binding.split("\n");
const typeBindings: string[] = typeBinding.split("\n");

interface LooseObject {
    [key: string]: any
}

var tbSections : LooseObject = {};

typeBindings.forEach(tb => {
    let sections : string[] = tb.split("=");
    tbSections[sections[0]] = sections[1];
});

let includes: string[] = new Array();
let output = input;
let lines: string[] = output.split("\n");
let newLines = JSON.parse(JSON.stringify(lines));

const functions = {
  DETERMINE_TYPE(caller : string, line: string): string {
    return eval(`${line.split(caller).join(tbSections[caller])}\n\ntypeof(${line.split("=")[0].split(" ")[1]})`);
  },
};

for (let i: number = 0; i < lines.length; i++) {
  let line: string = lines[i];

  console.log("Line " + i + ": " + line);

  bindings.forEach((b) => {
    line = lines[i];
    line = line.trim();

    console.log("Line " + i + ": (in binding) " + line);

    const sections: string[] = b.split("=");
    if (b.length < 2) return;

    const original: string = sections[0];
    const translation: string = sections[1];

    if (sections[2] && line.includes(original)) {
      const includesSection: string = sections[2];

      const includesArray: string[] = includesSection.split(",");

      includesArray.forEach((incl) => {
        if (!includes.includes(incl)) {
          includes.push(incl);
        }
      });
    }

    let parsedTranslation = translation;

    try {
      if (
        translation.startsWith("$(") && translation.endsWith(")$") &&
        line.includes(original)
      ) {
        const functionName = translation.split("$(").join("").split(")$").join(
          "",
        );

        let variableType = (<any> functions)[functionName](original, line);

        parsedTranslation = tbSections[variableType];
      }
    } catch (e) {
    }

    newLines[i] = newLines[i].split(original).join(parsedTranslation);
  });
}

output = `#include ${includes.join("\n#include ")}

${newLines.join("\n")}`;

Deno.writeTextFile(inputFile.split(".")[0] + ".c", output);
