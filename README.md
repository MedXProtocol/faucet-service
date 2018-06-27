# Faucet Service

This service provides a containerized faucet server for providing a custom token and ETH using Docker Compose.  The server can be deployed to production using the included Ansible playbooks, or deployed locally using Docker.

# Setup

1. Copy over config file
```bash
cp faucet-service.env.example faucet-service.env
```
2. Update the config to reflect your environment.  If you're running it locally you'll want to open the server up to localhost connections.  If you are deploying remotely you'll want to ensure that only certain domains are allowed; i.e. `http://faucet.medcredits.io`.  A local env file may look like:
```bash
# faucet-service.env
FAUCET_CONFIG_API_CORS_ORIGINS=["http://localhost:3000"]
```

# Running Locally

[Docker](https://www.docker.com/) must be installed.

1. Start the localhost server
```bash
./up.sh
```
2. Stop the localhost server
```bash
./down.sh
```

Logs are available at **/docker/var/logs** or you can view the live container logs:

```bash
cd docker
docker-compose logs -f
```

# Running remotely

[Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) is a server orchestration tool that simply connects to remote instances using SSH.  You can create or update an EC2 instance using the provided Ansible playbook.

### Setting up SSH

You'll need to acquire the correct EC2 key-pair pem file and set up SSH.  You can place the key-pair pem file in **~/.ssh** and update **~/.ssh/config** appropriately:

```bash
# ~/.ssh/config
Host faucet
  StrictHostKeyChecking no
  HostName 34.230.142.160
  User ec2-user
  IdentityFile ~/.ssh/faucet-key-pair.pem
```

Note the **Host** is **faucet**.  This is required by the Ansible playbooks.

### Setting up Ansible

Ansible requires **hosts** to be configured.  In Ansible parlance this represents your 'inventory'.  Hosts are the machines it connects to.

1. Create **~/.ansible.cfg** that defines where the host file is:
```bash
# ~/.ansible.cfg
[defaults]
inventory = ~/.ansible/hosts
```
2. Create a hosts file with the AWS elastic IP in **~/.ansible/hosts**:
```bash
# ~/.ansible/hosts
[faucet-server]
faucet <elasticIP> ?
[local]
localhost ansible_connection=local
```

### Updating Production

Ansible requires the user to have SSH access to the remote machine that it manages.  Make sure you have an AWS MedCredits IAM account with the 'developer' group.  Ensure your credentials have been added to your [~/.aws/credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html) file:

```
[default]
aws_access_key_id = ...
aws_secret_access_key = ...
[medcredits]
aws_access_key_id = ...
aws_secret_access_key = ...
```

Once your credentials have been added, export them into your terminal session.  To easily export any AWS profile to your terminal have a look at this [bash function](https://gist.github.com/asselstine/631eebb5bc2a8b59328e506a1f51f57a).  Otherwise you can simply `export AWS_ACCES...` with cut-and-paste.

The Ansible playbook will update the configuration for the existing server, or create a new one if it doesn't exist.  The playbook expects an Elastic IP to exist with the ip **34.230.142.160**.

NOTE: This Ansible playbook needs to run a couple of times.  Once to wait for the server to start, another to wait for the docker service.  You'll likely have to run it a couple of times if you're starting from scratch.

1. Ensure the **faucet-service.env** file has been configured for a production deploy:
```bash
# faucet-service.env
FAUCET_CONFIG_API_CORS_ORIGINS=["https://hippocrates.netlify.com", "https://app.medcredits.io"]
```
2. If the server has been setup previously, skip to step 3.  Otherwise setup a new server:
```bash
ansible-playbook setup-playbook.yml
```
3. To update the docker configuration and standard HTTP nginx config run:
```bash
ansible-playbook update-playbook.yml
```

# Connecting to Faucet

Once the service is running, you can connect to Faucet as you would normally.  The container exposes the ports 4001, 4002, 5001 and 8080.

## Troubleshooting

If after running `docker-compose up` you see an error like `Error: api not running` you will need to delete
the 'api' file in the Faucet repo directory.  The docker-compose.yml places this at *~/.faucet-service/data/api*

# TODO

- [ ] Add a CRON job to renew the certificate
- [ ] Add to the README how to request the certificate initially
