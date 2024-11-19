#!/usr/bin/env node
const { program } = require("commander");
const { execSync, spawn } = require("child_process");
const path = require("path");
const git = require("simple-git");
const fs = require("fs");

const dominateBackendPath = path.join(process.cwd(), "dominate-ai", "backend", "docker-compose");

program
  .command("start")
  .description("Start the dominate backend locally")
  .action(() => {
    console.log("Starting the dominate backend...");
    if (!fs.existsSync(dominateBackendPath)) {
      console.log("dominate-ai/backend/docker-compose directory not found. Please run `dominate install` first.");
      return;
    }
    const dockerCompose = spawn("docker-compose", ["-f", "docker-compose-dev.yml", "up", "-d", "--build"], {
      cwd: dominateBackendPath,
      stdio: "inherit",
    });
    dockerCompose.on("close", (code) => {
      if (code !== 0) {
        console.error(`docker-compose exited with code ${code}`);
      } else {
        console.log("dominate backend started successfully.");
      }
    });
  });

program
  .command("stop")
  .description("Stop the dominate backend")
  .action(() => {
    console.log("Stopping the dominate backend...");
    execSync("docker-compose -f docker-compose-dev.yml down", {
      cwd: dominateBackendPath,
      stdio: "inherit",
    });
    console.log("dominate backend stopped successfully.");
  });

program
  .command("install")
  .description("Pull the latest code from the dominate backend repository")
  .action(async () => {
    console.log("Pulling the latest code from the dominate backend repository...");
    const dominateBackendParentPath = path.join(process.cwd(), "dominate-ai");
    try {
      if (fs.existsSync(dominateBackendParentPath)) {
        console.log("dominate-ai directory already exists. Skipping installation.");
        return;
      }
      await git().clone("https://github.com/DominateAi/Dominate-AI.git", "dominate-ai", {
        "--depth": 1,
        "--single-branch": true,
      });
      console.log("Successfully pulled the latest code.");
    } catch (error) {
      console.error("Error pulling the latest code:", error);
    }
  });

program
  .command("logs")
  .description("View the logs of the running backend containers")
  .action(() => {
    console.log("Viewing logs of the running backend containers...");
    execSync("docker-compose -f docker-compose-dev.yml logs -f", {
      cwd: dominateBackendPath,
      stdio: "inherit",
    });
  });

program
  .command("help")
  .description("Display help information")
  .action(() => {
    console.log("Available commands:");
    console.log("  start    Start the dominate backend locally");
    console.log("  stop     Stop the dominate backend");
    console.log("  install  Pull the latest code from the dominate backend repository");
    console.log("  logs     View the logs of the running backend containers");
    console.log("  help     Display this help information");
  });

program.parse(process.argv);