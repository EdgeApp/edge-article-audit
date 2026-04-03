---
title: Viewing your Private View Key
intercom_id: '13892554'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772223087
description: |-
  To reveal the Private View Key for a Monero or Zano wallet in Edge:
  Open Edge and log into your account
  Tap on 'View Assets' or use the As...
url: 'https://support.edge.app/en/articles/13892554-viewing-your-private-view-key'
---
# To reveal the Private View Key for a Monero or Zano wallet in Edge:

1.  Open Edge and log into your account
    
2.  Tap on 'View Assets' or use the Assets tab to navigate to your wallets list
    
3.  Locate and tap into your privacy wallet (only XMR & ZANO)
    
4.  Use the vertical dots (⋮) to access this wallet's menu, then select 'Private View Key' near the bottom
    
5.  You may use the Copy button to copy this to your phone's clipboard
    

# For Additional Understanding:

Bytecoin was the first private blockchain, based on the CryptoNote whitepaper from 2012. This was forked into Monero, and later on, Zano also made use of CryptoNote technology to achieve cryptographic privacy. Transparent blockchains will typically involve 2 types of keys, a public key/address for receiving, and a private key for spending.

CryptoNote based privacy chains will have 4 types of keys: a Public spend and view key, and Private spend and view key. The public keys are embedded into the Receiving address, and you won't generally need to interact with them directly. Here's a visual example of how Public keys make up a Monero receive address:

![Screenshot 2025-07-17 at 2.51.12 PM.png](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520386/16dcb946f243fe5ed618031d5733/39084583335579?expires=1775187900&signature=301d211c0c436289a5885402187ee1ec0ac01e3a1019e91c6c7abb3a5e2a2499&req=diEmFMx8nYJXX%2FMW1HO4zatseGwH%2B1Qn%2BfnZP5WJ7UFpQZXySXc410PhONEl%0Ab4fe%0A)

A Private spend key allows for spending funds, and this should never be shared. A private view key only decrypts the transaction data, so balances can be seen, but no funds can be moved. This can be used like a watch-address and may be used by a wallet app, tax software, a payment portal or any application that would make need to be able to read your private wallet balance.
