# credential-handler-demo
Credential Handler API demo

## Running the demo credential repository

Clone the repo:

```
git clone https://github.com/digitalbazaar/credential-handler-demo
```

Enter the demo credential repository directory:

```
cd angular-credential-repository
```

Install its dependencies:

```
npm install
```

Make its development domain name resolve to your local machine by
editing your `/etc/hosts` file and adding an entry:

```
sudo nano /etc/hosts
```

```
127.0.0.1 <any other existing entries> example.credential-repository.localhost
```

Run the demo credential repository:

```
npm start
```
