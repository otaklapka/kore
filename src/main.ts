import { Command, EnumType } from "@cliffy/command";
import { parseAll } from "@std/yaml";
import { CliOptions, KoreOptions, Output } from "./types.ts";
import { Kore } from "./kore.ts";
import { KoreTable } from "./kore_table.ts";

const parseStdInOrExit = async (): Promise<unknown[] | never> => {
  const decoder = new TextDecoder();
  let stdIn: string | undefined = undefined;
  for await (const chunk of Deno.stdin.readable) {
    stdIn = decoder.decode(chunk);
  }

  if (stdIn) {
    try {
      return parseAll(stdIn) as object[];
    } catch (err) {
      console.error(
        `Failed to parse yaml from stdin. ${
          (err as Error | undefined)?.message
        }`,
      );
    }
  }
  return Deno.exit(1);
};

const parseInputFilesOrExit = async (files: string[]): Promise<unknown[]> => {
  const fileObjs = await Promise.all(
    files.map(async (file) => {
      const fileContents = await Deno.readTextFile(file).catch(() => {
        console.error(`File ${file} not found`);
        Deno.exit(1);
      });

      try {
        return parseAll(fileContents) as unknown[];
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

  return fileObjs.flat();
};

const run = async (options: CliOptions, ...args: string[]): Promise<void> => {
  if (Deno.stdin.isTerminal() && !args.length) {
    console.error("No input");
    Deno.exit(1);
  }

  const docs: unknown[] = Deno.stdin.isTerminal()
    ? await parseInputFilesOrExit(args)
    : await parseStdInOrExit();

  const koreOptions: KoreOptions = {
    verbose: options.verbose,
    abbreviateNames: options.abbreviateNames === true
      ? 30
      : options.abbreviateNames,
  };

  const kore = new Kore(docs, koreOptions);

  switch (options.output) {
    case Output.Json:
      console.log(JSON.stringify(kore.toJSON()));
      break;
    default:
      new KoreTable(kore.toJSON(), koreOptions).printTable();
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
  .option(
    "-a, --abbreviate-names [abbreviate-names:integer]",
    "Abbreviate object names in table to length, default 30",
  )
  .arguments("[files...]")
  .action((options: CliOptions, ...args: string[]) => run(options, ...args))
  .parse(Deno.args);
