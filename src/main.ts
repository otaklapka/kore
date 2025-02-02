import { Command } from "@cliffy/command";
import { parseAll } from "@std/yaml";
import { Options } from "./types.ts";
import { Kore } from "./kore.ts";
import { KoreTable } from "./kore_table.ts";

const run = async (options: Options, ...args: string[]): Promise<void> => {
  const docs: object[] = await Promise.all(
    args.map(async (file) =>
      parseAll(await Deno.readTextFile(file)) as object[]
    ),
  );

  const kore = new Kore(docs.flat());
  const koreTable = new KoreTable(kore.intoInfo());
  koreTable.printTable();
};

await new Command()
  .name("kore")
  .version("0.0.1-alpha")
  .description("Tool to aggregate kubernetes object resources")
  .option("-v, --verbose", "Enable verbose output")
  .arguments("<files...>")
  .action((options: Options, ...args: string[]) => run(options, ...args))
  .parse(Deno.args);
