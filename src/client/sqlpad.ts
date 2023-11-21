import axios from "axios";
import cookie from "cookie";
import Session from "../types/session";

interface AuthenticationResponse {
  authenticated: boolean;
  session?: Session;
  raw: object;
}

export interface Connection {
  id: string;
  name: string;
  driver: string;
}

export interface EstablishConnectionResponse {
  id: string;
  name: string;
}

export interface ExecuteQueryRequest {
  connectionId: string;
  connectionClientId: string;
  batchText: string;
  selectedText: string;
}

interface Statement {
  id: string;
  status: BatchStatus;
  columns: Array<{
    datetype: string;
    name: string;
  }>;
}

type Row = Array<unknown>;

export type BatchStatus = "finished" | "started" | "error";

interface BatchResponse {
  id: string;
  statements: Array<Statement>;
  status: BatchStatus;
}

export interface QueryResponse {
  result?: Array<object>;
  status: BatchStatus;
}

export default class SQLPadInstanceClient {
  instance: string;

  constructor(instance: string) {
    this.instance = instance;
  }

  async executeQuery(
    request: ExecuteQueryRequest,
    token: string
  ): Promise<QueryResponse> {
    const response: BatchResponse = (
      await axios.post(this.instance + "/api/batches", request, {
        headers: {
          Cookie: "sqlpad.sid=" + token,
        },
      })
    ).data;

    const statement = (await this.getQueryResult(response.id, token))
      ?.statements[0]!;

    if (statement.status === "error") {
      return {
        status: statement.status,
      };
    }

    const rows = await this.getStatementRows(statement.id, token);

    return {
      status: statement.status,
      result: rows.map((row) => {
        const object: any = {};

        statement.columns.forEach((column, index) => {
          object[column.name] = row.at(index);
        });

        return object;
      }),
    };
  }

  async getStatementRows(
    statementId: string,
    token: string
  ): Promise<Array<Row>> {
    const response = (
      await axios.get(
        this.instance + "/api/statements/" + statementId + "/results",
        {
          headers: {
            Cookie: "sqlpad.sid=" + token,
          },
        }
      )
    ).data;

    return response;
  }

  async getQueryResult(batchId: string, token: string): Promise<BatchResponse> {
    const response: BatchResponse = (
      await axios.get(this.instance + "/api/batches/" + batchId, {
        headers: {
          Cookie: "sqlpad.sid=" + token,
        },
      })
    ).data;

    if (response.status === "finished") {
      return response;
    }

    if (response.status === "error") {
      return response;
    }

    return this.getQueryResult(batchId, token);
  }

  async establishConnection(
    connectionId: string,
    token: string
  ): Promise<EstablishConnectionResponse> {
    const response = await axios.post(
      this.instance + "/api/connection-clients",
      {
        connectionId,
      },
      {
        headers: {
          Cookie: "sqlpad.sid=" + token,
        },
      }
    );

    return response.data;
  }

  async availableConnections(token: string): Promise<Array<Connection>> {
    const response = await axios.get(this.instance + "/api/connections", {
      headers: {
        Cookie: "sqlpad.sid=" + token,
      },
    });

    return response.data;
  }

  async authenticate({
    user,
    password,
  }: {
    user: string;
    password: string;
  }): Promise<AuthenticationResponse> {
    const response = await axios.post(
      this.instance + "/api/signin",
      {
        email: user,
        password,
      },
      {
        validateStatus: null,
      }
    );

    if (response.status === 200) {
      const authCookie = response.headers["set-cookie"]
        ?.map((item) => cookie.parse(item))
        .find((cookie) => Object.hasOwn(cookie, "sqlpad.sid"));

      if (!authCookie) {
        throw new Error("SQLPad authentication cookie not found");
      }

      return {
        authenticated: true,
        session: {
          id: authCookie["sqlpad.sid"],
          expiresIn: new Date(authCookie.Expires),
        },
        raw: authCookie,
      };
    }

    return {
      authenticated: false,
      raw: response.data,
    };
  }
}
