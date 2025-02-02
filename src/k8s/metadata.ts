export class Metadata {
  constructor(public readonly name: string) {}

  static from(data: any): Metadata {
    if (
      typeof data === "object" &&
      typeof data?.name === "string"
    ) {
      return new Metadata(data.name);
    }
    throw new Error("Invalid input data");
  }
}
