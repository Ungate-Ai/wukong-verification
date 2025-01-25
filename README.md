# Ungate AVS Operator Project 

## ▶️ Run an Attestor Node
We provide a  docker-compose configuration which sets up the Attestor Node

To set up the environment, create a `.env` file with the usual Ungate
configurations (see the `.env.example`), then run:

```console
docker-compose up
```

## 🏗️ Architecture
The Ungate Attester nodes communicate with an AVS WebAPI endpoint which
validates tasks on behalf of the nodes. The attesters then sign the tasks based
on the AVS WebAPI response.

Attester nodes all communicate with a centralized endpoint.

![image](https://github.com/user-attachments/assets/bb118ec0-ae8d-4e01-8e76-9caee34182af)

