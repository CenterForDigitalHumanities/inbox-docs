# LDN with IIIF Data Sharing Specification

Editors: *Jeffrey C. Witt (Loyola University Maryland), Patrick Cuba (St. Louis University), Régis Robineau (Biblissima)*

*Status: Draft*

## Basic Uses Inbox to connect IIIF content

1. Submit an announcement: POST an object as seen below to `http://inbox.rerum.io/messages`.
2. Retrieve announcements for an object: `GET inbox.rerum.io/messages?target=URI`.
3. Modify an announcement: `PUT inbox.rerum.io/id/[ID]` for replacement.
4. `DELETE` and `PATCH` are not currently supported.

## Service Block

To be included in a manifest a service block

~~~json
"service": {

"@context": "http://www.w3.org/ns/ldp#inbox",

"@id":"http://inbox.rerum.io/messages?target=http://example.com/book1/manifest.json",

"inbox":"http://inbox.rerum.io/messages?target=http://example.com/book1/manifest.json"

"profile": "http://www.w3.org/ns/ldp#inbox",

"label": "Linked Data Notifications inbox"

}
~~~

## POST Payload