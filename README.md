# credential-handler-demo
Credential Handler API demo

## Background

A Credential Handler is an event handler for credential request and
credential storage events. The [Credential Handler API][] helps
solve the [Nascar Problem][https://indieweb.org/NASCAR_problem]. The
[Credential Handler API][] enables websites to install Credential Handlers that
can respond when users visit other websites that request or store credentials.

For example, a user may visit a website that wants them to login using
OpenIdConnect, provide an OAuth Token, authenticate using a [DID][], or present
some [Verifiable Credentials][]. When these other websites use the [Credential
Handler API][], the user is shown an in-browser selection screen with visual
representations (e.g. icons and origin information) of only those
Credential Handlers that they have been previously installed by the user and
that are compatible with the website's request. Once the user makes a choice,
the appropriate Credential Handler is loaded and a credential event is sent
to it.

The Credential Handler receives the event via a
[Service Worker][https://w3c.github.io/ServiceWorker] or, if the
[Credential Handler Polyfill][] is used, a simple page with no UI elements is
loaded that uses the polyfill to receive and respond to the event.

The Credential Handler must respond to the event with a credential that
fulfills the request. If necessary, the Credential Handler may open a window
on its website's origin to allow the user to interact with its website prior
to responding. This UI can be styled and shaped according to the website
owner's brand using arbitrary JavaScript and HTML like any other webpage.

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

## License

The code in this repository is under a BSD license. ***However***, it relies on
packages that are not. Specifically, the demo makes use of the Bedrock framework
which is under a different, [Non-commercial license](https://github.com/digitalbazaar/bedrock/blob/master/LICENSE.md).

[DID]: https://w3c-ccg.github.io/did-spec
[Verifiable Credentials]: https://w3c.github.io/vc-data-model
[Decentralized Identifiers (DIDs)]: https://w3c-ccg.github.io/did-spec
[Credential Handler API]: https://w3c-ccg.github.io/credential-handler-api
[Credential Handler API Repo]: https://github.com/w3c-ccg/credential-handler-api
[Credential Handler API Demo]: https://github.com/digitalbazaar/credential-handler-demo
[Credential Handler Polyfill]: https://github.com/digitalbazaar/credential-handler-polyfill
