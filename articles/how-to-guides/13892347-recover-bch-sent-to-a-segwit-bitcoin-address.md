---
title: Recover BCH sent to a "segwit" Bitcoin address
intercom_id: '13892347'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222735
description: >-
  Unfortunately, due to rules in the BCH network, there is no way for our wallet
  or engineers to recover your Bitcoin Cash - however, your f...
url: >-
  https://support.edge.app/en/articles/13892347-recover-bch-sent-to-a-segwit-bitcoin-address
---
# Unfortunately, due to rules in the BCH network, there is no way for our wallet or engineers to recover your Bitcoin Cash - however, your funds may be recoverable with the help of a BCH miner!

*They can use your wallet information to create a transaction on your behalf and include it in a block that they mine (for a fee)*

They require three pieces of information in order to recover your funds.

1.  The Bitcoin Cash **T****ransaction ID** (hash)
    
    -   Find this in your sent transaction details
        
2.  **Public Key** for the Bitcoin address where the funds were sent
    
    -   This is different from your normal receiving address needs to found using a derivation tool: [https://edge.app/recovery](https://edge.app/recovery)
        
        1.  In Edge, tap and hold on the BTC wallet that holds the misplaced BCH
            
        2.  Tap on Master Private Key
            
        3.  Write down the private seed phrase exactly
            
        4.  Enter the seed phrase in the [derivation tool](https://edge.app/recovery) - "BIP39 Mnemonic" field
            
        5.  Under Derivation Path, select BIP49
            
        6.  Under Derived Addresses, find the address where the funds were sent
            
        7.  The public key you is listed right next to this BCH address
            
3.  An **A****ddress to Receive** Bitcoin Cash
    
    -   This is the address you want the recovered BCH sent to. In Edge, your BCH wallet address will begin with “q...”
        

Share these three pieces of information with a BCH miner and they may agree to attempt to recover your funds.
