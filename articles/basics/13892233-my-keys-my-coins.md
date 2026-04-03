---
title: 'My Keys, My Coins'
intercom_id: '13892233'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222573
description: >-
  What does it mean to "hold" your own coins?In cryptocurrency, you prove
  ownership of coins by using the private key of the wallet those to...
url: 'https://support.edge.app/en/articles/13892233-my-keys-my-coins'
---
# What does it mean to "hold" your own coins?

In cryptocurrency, you prove ownership of coins by using the **private key** of the wallet those tokens are in.

Private keys are a long alpha-numeric code and are each paired with a public receiving address (aka. public key).

These private keys are used to cryptographically "sign" a transaction to show that you approved it.

Therefore, *anybody* with the private keys can approve new transactions for that wallet.

# What about seed phrase?

A **seed phrase** is a special standardized password format that can be used to generate pairs of private and public keys for use on cryptocurrency networks.

Seed phrases are typically 12-24 words and come in this human readable format to prevent accidents when storing the code, while maintaining high complexity in combinations.

# Where are my keys and my seeds?

Edge is **self-custodial**, which means that only YOU have access to the private keys for each wallet in your Edge account.  
(see [What's the difference between custodial and non-custodial?](https://support.edge.app/hc/en-us/articles/7018009165339))

Edge also encrypts ALL user data on your device before saving.

Logging in from a new device will pull an encrypted backup that can be only be decrypted locally with your full password.

# Bitcoin and receiving addresses

In some Bitcoin-based networks (BTC, LTC, BCH, etc.), a wallet will have an "extended" public address - often called an **XPUB**.

This XPUB can be used to determine all the possible receiving addresses which can be derived from this wallet's seed phrase.

# Using multiple addresses

In apps that support native **HD wallet** functionality (such as Edge) your receiving address will change with each receive transaction so that each address is only used once.

New transactions will spend funds from any address with funds, no need to keep track of private-public key pairs.

*Fun fact: Edge preserves user privacy by selecting the best addresses to spend from!*

(see [What is a UTXO?](https://support.edge.app/hc/en-us/articles/13238555977627))

# Does ethereum have multiple addresses?

In Edge, it is more secure *not* to use multiple addresses from the *same seed phrase*.

Without native HD wallet functionality on Ethereum, there isn't a great way to use multiple Ethereum address (accounts) to enhance privacy.

Instead, keeping ETH wallets separate helps keep your funds safer in case you connect to a fraudulent service or expose the seed for that wallet.
