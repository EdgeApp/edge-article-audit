---
title: How does Edge secure my private keys?
intercom_id: '13892301'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222668
description: >-
  The methods that bitcoin wallets use to secure private keys has been a hot
  topic lately and we want to inform our users and the crypto-com...
url: >-
  https://support.edge.app/en/articles/13892301-how-does-edge-secure-my-private-keys
---
The methods that bitcoin wallets use to secure private keys has been a hot topic lately and we want to inform our users and the crypto-community at large how Edge secures our user’s private keys. Some software wallets store the user’s private key unencrypted on the user’s device or encrypted with a single, fixed encryption key that is common for all users. This creates a security flaw in that malicious apps with access to the storage of the device could easily access the private key.

At Edge, we felt that proper security **requires** that private keys are ALWAYS encrypted before being saved on the device, *and* that the encryption use **a unique and strong password that only the user knows**. To further increase the security, the user’s password is hashed into a pseudo-random number using a CPU and memory intensive algorithm (Scrypt) that is dynamically tuned to the speed of the user’s device. The faster the device, the stronger the hashing, the harder it is to brute force a user’s password. That strong cryptographic hash is the encryption key that secures the user’s data, helping protect it from malware on the device.

Additionally our code base is [open source](http://github.com/EdgeApp) and our [white paper](http://edge.app/wp-content/uploads/2018/09/2017-10-Edge-White-Paper.pdf) is available for those interested in the details of our Edge Security platform. Our architecture has undergone a 3rd party security audit and we feel very confident we’ve found the right balance of security and ease of use for the masses and advanced users.

Feel free to reach out to us if you have any questions about our security model and philosophy. We are always looking to improve and your feedback is appreciated.
