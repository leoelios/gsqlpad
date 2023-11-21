import SQLPadInstanceClient from "../../client/sqlpad";
import toInserts from "../../utils/json-to-insert";
import { getInstanceById } from "../../utils/local-config";
import { chooseConnection, updateInstanceSessionIfNecessary } from "./query";

export default async function exportInserts(instanceId: string, table: string) {
  try {
    if (!table || table === null || table === "") {
      throw new Error("Table must be specified");
    }

    const instance = getInstanceById(instanceId);

    if (!instance) {
      throw new Error(
        `Instance ${instanceId} not configure, show all configured instances by using "gsqlpad instances" command.`
      );
    }

    await updateInstanceSessionIfNecessary(instance);

    const connection = await chooseConnection(instance);
    const client = new SQLPadInstanceClient(instance.instance);

    const query = `select * from ${table}`;

    const response = await client.executeQuery(
      {
        connectionClientId: connection.established.id,
        batchText: query,
        selectedText: query,
        connectionId: connection.connection.id,
      },
      instance.session.id
    );

    console.log(toInserts(table, response.result!));
  } catch (error) {
    console.error(`🔴 ${error}`);
    console.debug(error);
  }
}
