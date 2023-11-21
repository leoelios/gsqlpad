import SQLPadInstanceClient, {
  Connection,
  EstablishConnectionResponse,
} from "../../client/sqlpad";
import Instance from "../../types/Instance";
import { getInstanceById, isInstanceExpired } from "../../utils/local-config";
import { generateSession } from "./auth";
import readline from "readline";
import toEmoji from "../../utils/number-to-emoji";
import { printBanner } from "../../utils/banner";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => resolve(answer));
  });
}

export async function updateInstanceSessionIfNecessary(instance: Instance) {
  if (isInstanceExpired(instance)) {
    console.log("🟠 session tokens expired, re-trying generate new session...");
    instance.session = await generateSession({
      instance: instance.instance,
      password: instance.password,
      user: instance.user,
      identifier: instance.identifier,
    });
  } else {
    console.log("🟢 reusing tokens previously generated...");
  }
}

async function startInterativePrompt(instance: Instance) {
  console.log(
    `\n💬 connected to ${instance.identifier} = ${instance.instance}`
  );

  const connection = await chooseConnection(instance);

  interativePrompt(instance, connection);
}

export async function chooseConnection(instance: Instance): Promise<{
  established: EstablishConnectionResponse;
  connection: Connection;
}> {
  const client = new SQLPadInstanceClient(instance.instance);
  const token = instance.session.id;
  const connections = await client.availableConnections(token);

  console.log("\n\n+-----------------------------+");
  console.log("|    🖌 choose a connection   |");
  console.log("+-----------------------------+");

  connections.forEach((connection, index) => {
    console.log(`\n${toEmoji(index + 1)}  -> ${connection.name}`);
    console.log(`---------------------`);
  });

  const choosen = await askQuestion(">> ");
  const connection = connections.at(parseInt(choosen) - 1)!;
  const createdConnection = await client.establishConnection(
    connection.id,
    token
  );

  printBanner();

  console.log(`🟢 connected to "${createdConnection.name}" successfully`);
  console.log("generated connection id: " + createdConnection.id + "\n\n");

  return {
    established: createdConnection!,
    connection,
  };
}

function interativePrompt(
  instance: Instance,
  connection: {
    established: EstablishConnectionResponse;
    connection: Connection;
  }
) {
  rl.question("gsqlpad> ", async (query) => {
    // 1. process query and get results
    const client = new SQLPadInstanceClient(instance.instance);
    const response = await client.executeQuery(
      {
        connectionClientId: connection.established.id,
        batchText: query,
        selectedText: query,
        connectionId: connection.connection.id,
      },
      instance.session.id
    );

    console.table(response.result);

    interativePrompt(instance, connection);
  });
}

export default async function query(instanceId: string) {
  try {
    const instance = getInstanceById(instanceId);

    if (!instance) {
      throw new Error(
        `Instance ${instanceId} not configure, show all configured instances by using "gsqlpad instances" command.`
      );
    }

    await updateInstanceSessionIfNecessary(instance);

    await startInterativePrompt(instance);
  } catch (error) {
    console.error(`🔴 ${error}`);
    console.debug(error);
  }
}
