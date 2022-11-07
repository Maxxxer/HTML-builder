const fs = require("fs");
const path = require("path");
const { stdout, stdin } = require("process");
const writeStream = fs.createWriteStream(path.join(__dirname, "text.txt"),  "utf-8");

stdout.write("Hello, enter text.\n ");
stdin.on("data", (text) => {
  if (
    text.toString().trim() === "exit" ||
    text.toString().trim() === "Exit" ||
    text.toString().trim() === "EXIT"
  ) {
    process.exit();
  }
  writeStream.write(text);
});
process.on("exit", () => console.log("\nThank you"));
process.on("SIGINT", () => process.exit());
