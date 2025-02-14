# Ungate Wukong Verification Service

## ▶️ Run an Verifier Node
We provide a  docker-compose configuration which sets up the Attestor Node

To set up the environment, create a `.env` file with the usual Ungate
configurations (see the `.env.example`), then run:

```console
docker compose build --no-cache
docker compose up
```

## 🏗️ Architecture
The Ungate Verifier nodes communicate with an AVS WebAPI endpoint which
validates tasks on behalf of the nodes. The verifiers then sign the tasks based
on the AVS WebAPI response.

Verifiers nodes all communicate with a aggregator endpoint.

![image](https://github.com/user-attachments/assets/44af0d9c-acee-43fd-8555-94a29179ef3a)


