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

The `@id` and `inbox` and the `@context` and `profile` property pairs SHOULD match and both be present to allow the service to be recognized by both the internal context and the generic IIIF JSON-LD service block protocols.

## POST Payload

To be sent via a `POST` request to the value of the `inbox` property in the manifest service block

~~~json
{
  "@context": "http://iiif.io/api/presentation/2/context.json",
  "@type": "as:Announce",
  "motivation": "supplementing",
  "actor":{
    "@id": "https://scta.info/#identity”,
    "label": "SCTA"
  },
  "target": "http://inbox.rerum.io?target=http://example.com/book1/manifest.json",
  "Object": {
    "@id":"http://scta.info/iiif/lombardsententia/bnf15705/ranges/toc/wrapper",
    "@type":"sc:Range",
    "attribution": "Created by Joe",
    "description": "Table of Contents missing from the published Sequence.",
    "license": "https://creativecommons.org/licenses/by-sa/4.0/",
    "logo": "http://link.to.logo.png"
  }
}
~~~

Values MUST be provided for `@context`, `@type`, `motivation`, and `target`. The `"supplementing"` motivation shown here is conventional and formally undefined. It identifies the current case of offering an augmentation to the original object without insisting on an update or replacement. Using other motivations from Web Annotations or Activity Streams is acceptable and will be the primary way others understand how to consume your announcement. Applications presenting the announcements MUST display the object's `attribution` and `logo` if provided.

## Basic structure of individual notifications

To be returned by an inbox when an inbox notification id is dereferenced

~~~json
{
  "@id": "http://inbox.rerum.io/id/1",
  "@context": "http://iiif.io/api/presentation/2/context.json",
  "@type": "as:Announce",
  "motivation": "supplementing",
  "published": "2017-01-02",
  "actor":{
    "@id": "https://scta.info/#identity,
    "label": "SCTA"
  },
  "target": "http://example.com/book1/manifest.json",
  "object": {
    "@id":"http://scta.info/iiif/lombardsententia/bnf15705/ranges/toc/wrapper",
    "@type":"sc:Range",
    "attribution": "Created by Joe",
    "description": "Table of Contents missing from the published Sequence.",
    "license": "creative commons link"
    "logo": "http://link.to.logo.png"
  }
}
~~~

Fields in excess of these provided in messages may not be returned at the discretion of the individual inboxes. The `published` field is added by the inbox when new postings are received and will be overwritten if included by the client.