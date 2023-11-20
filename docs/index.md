# gsqlpad - docs

Useful documentation for gsqlpad CLI usages.

## commands

some available commands.

### configure

add a new SQLPad instance configuration.

In your terminal, execute:

```shell
gsqlpad configure \
    --instance-name myinstance \
    --user myuser@domain.com \
    --password PASS_HERE \
    --instance localhost:3000
```

Post executed, the following result must be displayed.

```shell
root $ gsqlpad configure --instance-name myinstance --user myuser@domain.com --password PASS_HERE --instance localhost:3000

🔘 Validating specified instance
🔘 Validating provided credentials

✅ Instance configured successfully!
```

And then, the configuration will be available at `$HOME/.gsqlpad/config` JSON file.

### import-config

In the same way that it's possible configure instances manually via `configure` command, it's too possible import a configuration,
the file should follow the following JSON schema.

```json
/config.json

{
  "instances": [
    {
      "name": "string",
      "user": "string",
      "password": "string",
      "uri": "string"
    }
  ]
}
```

```shell
gsqlpad import-config --config-file=config.json
```

```shell
gsqlpad import-config --config-file=config.json

🔘 Validating config file

✅ Configuration imported successfully.
```

And then, the content of config file at `$ROOT/.gsqlpad/config.json` will be replaced by the specified config file.

### query

Open a query terminal to a specific instance.

```shell
gsqlpad query --instance=myinstance

✅ Connected successfully to localhost:3000

> SELECT * FROM test.test;

+-----------+-------------+----------+
|     id    |    name     |   age    |
+-----------+-------------+----------+
```
