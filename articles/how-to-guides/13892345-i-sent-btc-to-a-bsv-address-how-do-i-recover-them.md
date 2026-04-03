---
title: 'I sent BTC to a BSV address, how do I recover them?'
intercom_id: '13892345'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222732
description: >-
  Please note that Bitcoin (BTC) and Bitcoin SV (BSV) are two different
  currencies with two different chains, so you should never send BTC t...
url: >-
  https://support.edge.app/en/articles/13892345-i-sent-btc-to-a-bsv-address-how-do-i-recover-them
---
Please note that Bitcoin (BTC) and Bitcoin SV (BSV) are two different currencies with two different chains, so you should never send BTC to a BSV wallet.

If you accidentally sent your Bitcoin (BTC) to a BSV (BSV) address, you can try a recover.

Here below the steps:

1\. Take note of the Master Private Key of the BSV wallet to which you sent the BTC.  
Open Edge, wallets list, tap and hold BSV wallet, tap Master Private Key, enter your password and copy those words one by one on a notepad (you cannot copy them directly).

**WARNING: Exposing your private keys can be risky if you do not take the right precautions. Using a private browser or opening the derivation tool on an air-gapped PC will help prevent malicious software from stealing your keys. Most users will not need to follow these steps and they are presented for informational use only. Remember to close the notepad once done.**  
  
2\. Now you need to derive the individual private keys: we recommend using Ian Coleman's tool [https://iancoleman.io/bip39/](https://iancoleman.io/bip39/). All bitcoin-related currencies in Edge can be derived using this tool.

Generally, the process to derive private keys is the same for each currency and involves these three steps:-Enter private seed (24 word phrase) into the "BIP39 Mnemonic" field-Change the Coin.  
  
In your case choose Bitcoin SV (BSV) from the Ian Coleman Coin section. If you don't see your address, try with Bitcoin Cash as Coin.

Look down and search for the address you accidentally sent BTC to. When you find it, on the right you'll see the private key.

If you hover over the private key it will give you a QR code that will make the next step easier.  
​

3\. Open Edge, tap on the Side Menu, Tap Scan QR Code, point at QR confirm and wait for the funds to be transferred into your BTC wallet.  
A BTC transaction will be created, then you will pay a variable fee depending on the conditions of the Bitcoin network.
