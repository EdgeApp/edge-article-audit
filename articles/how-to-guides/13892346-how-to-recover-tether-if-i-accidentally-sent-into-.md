---
title: How to recover Tether if I accidentally sent into a Bitcoin Address?
intercom_id: '13892346'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222733
description: >-
  Airbitz and Edge do not natively support Tether (USDT), but USDT sent to an
  Edge bitcoin address can be recovered. The process requires yo...
url: >-
  https://support.edge.app/en/articles/13892346-how-to-recover-tether-if-i-accidentally-sent-into-a-bitcoin-address
---
Airbitz and Edge do not natively support Tether (USDT), but USDT sent to an Edge bitcoin address can be recovered. The process requires you to retrieve the private key that controls the address with USDT and import it into a USDT-compatible wallet. This guide uses omniwallet.org, but you can use any USDT wallet that supports importing private keys. Currently, you're only able to recover USDT sent to a legacy (1-address) as there are no USDT wallets that support importing segwit addresses (3-address). Note: It is HIGHLY recommended that send you send your bitcoin to a different wallet in Edge and completing the following steps offline. Exposing your private seed to the internet could result in your funds being stolen.

1.  Retrieve your Wallet Private Seed
    
    -   BTC wallet was created in Airbitz (hexadecimal)
        
        1.  From the main screen, tap on the three dots in the upper right corner
            
        2.  Export
            
        3.  Wallet Private Seed (advanced)
            
        4.  Enter your password, and then tap View
            
    -   BTC wallet was created in Edge (mnemonic phrase)
        
        1.  Tap on the three dots to the right of your bitcoin wallet
            
        2.  Master Private Key
            
2.  Enter your private seed into the BIP39 Mnemonic Code Convertor ([https://edge.app/wp-content/uploads/2022/01/bip39-standalone.html](https://edge.app/wp-content/uploads/2022/01/bip39-standalone.html). This page is a modified version of [https://github.com/iancoleman/bip39](https://github.com/iancoleman/bip39) that includes support for hexadecimal private seeds.
    
    -   BTC wallet was created in Airbitz
        
        1.  Enter hexadecimal private seed into the Private Key Hex Field
            
        2.  Select BIP32 under Derivation Path
            
        3.  Set a custom derivation path to m/0/0
            
    -   BTC wallet was created in Edge
        
        1.  Enter the mnemonic phrase into the BIP39 Root Key field
            
        2.  Select BIP44 under Derivation Path
            
3.  Locate the address that contains the Tether under the Derived Addresses section. Record the private key associated.
    
4.  Log into your [https://www.omniwallet.org/](https://www.omniwallet.org/) wallet
    
5.  My Addresses > Add Address > Import Address With Private Key
    
6.  Enter the private key and tap Add Address
