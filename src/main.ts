import { Command, EnumType } from "@cliffy/command";
import { parseAll } from "@std/yaml";
import { Options, Output } from "./types.ts";
import { Kore } from "./kore.ts";
import { KoreTable } from "./kore_table.ts";

const run = async (options: Options, ...args: string[]): Promise<void> => {
  const docs: object[] = await Promise.all(
    args.map(async (file) => {
      const fileContents = await Deno.readTextFile(file).catch((err) => {
        console.error(`File ${file} not found`);
        if (options.verbose) {
          console.error(`JS Error: ${err}`);
        }
        Deno.exit(1);
      });

      try {
        return parseAll(fileContents) as object[];
      } catch (err) {
        console.error(
          `Failed to parse yaml file ${file}. ${
            (err as Error | undefined)?.message
          }`,
        );
      }
      Deno.exit(1);
    }),
  );

  const kore = new Kore(docs.flat());

  switch (options.output) {
    case Output.Json:
      console.log(JSON.stringify(kore.intoInfo()));
      break;
    default:
      new KoreTable(kore.intoInfo()).printTable();
      break;
  }
};

const outputType = new EnumType(Object.values(Output));

await new Command()
  .name("kore")
  .version("0.0.1-alpha")
  .description("Tool to aggregate kubernetes object resources")
  .type("output-type", outputType)
  .option("-o, --output <output:output-type>", "Output format", {
    default: Output.Table,
  })
  .option("-v, --verbose", "Enable verbose output")
  .arguments("<files...>")
  .action((options: Options, ...args: string[]) => run(options, ...args))
  .parse(Deno.args);
