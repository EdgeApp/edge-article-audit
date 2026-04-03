---
title: Accelerating Ethereum & EVM Transactions in Edge Wallet
intercom_id: '13892313'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222683
description: >-
  This guide explains when to accelerate a stuck transaction and how to do it in
  Edge for Ethereum and EVM chains (Arbitrum, Base, BNB Smart...
url: >-
  https://support.edge.app/en/articles/13892313-accelerating-ethereum-evm-transactions-in-edge-wallet
---
This guide explains **when** to accelerate a stuck transaction and **how** to do it in Edge for Ethereum and EVM chains (Arbitrum, Base, BNB Smart Chain, Pol, Avalanche-C, etc.).

---

# What “accelerate” actually does

-   Every account uses a **nonce** (0,1,2…). The **oldest pending** nonce must confirm before any newer transaction can confirm.
    
-   **Accelerate (Speed Up)** = send the **same transaction** again with the **same nonce** but **higher gas** so miners/validators prefer it.
    

---

# When should you accelerate?

-   A send/contract call shows **Pending** far longer than typical blocks (e.g., >5–10 minutes on ETH mainnet).
    
-   You chose **low fees** or network congestion spiked after you sent.
    
-   A **stuck older nonce** is blocking newer transactions.
    

**Don’t accelerate** if:

-   The transaction is already **confirmed** (cannot be changed).
    
-   You don’t have enough **native coin** (ETH / MATIC / BNB, etc.) to pay the higher fee.
    
-   The network explorer shows the tx in a **very recent block** (just wait for confirmations/propagation).
    

---

# How to accelerate in Edge

1.  **After sending on Edge → Tap Assets → Tap Desired Wallet →** Tap the **pending** transaction in your recent transaction history.
    
2.  Tap "**Accelerate this transaction"**.
    
3.  **Confirm** and and slide to submit.
    

---

# How to check current fees

-   Gas Tracker [https://etherscan.io/gastracker](https://etherscan.io/gastracker)
    

---

# Network notes (EVM chains)

-   **ETH mainnet**: EIP-1559 required. Congestion varies widely—use higher buffers during NFT mints/airdrops/major events.
    
-   **Layer-2s (Arbitrum/Optimism/Base)**: Fees are low but spikes happen; the same replacement rules apply.
    
-   **Polygon/BNB/Avalanche/Fantom**: Some RPCs are strict about the **minimum bump**—if you get “underpriced,” increase both tip and max fee more.
    

---

# Troubleshooting

-   **Still pending after speed-up:**
    
    -   The tx might already be in a block that your app hasn’t shown yet → check on a block explorer by **hash**.
        
-   **Newer txs won’t confirm:**
    
    -   An **older nonce** is stuck → you must **speed up** the **oldest** pending tx first.
        
-   **Insufficient funds for gas:**
    
    -   Receive/exchange/buy a small amount of the **native coin** to cover the higher fee, then retry.
        
-   **Token transfers/approvals:**
    
    -   Remember: fees are **always in the chain’s native coin** (not the token you’re sending).
        

---

# FAQs

**Does accelerating cost extra?**  
Yes. You pay the fee for whichever replacement transaction confirms (the others get dropped).

**Can I accelerate multiple times?**  
Yes, but only the **highest-fee** replacement is likely to win. Each attempt risks paying more—choose a meaningful bump instead of many tiny ones.

**Will cancel always work?**  
Only if the **cancel** confirms **before** the original. If the original confirms first, the cancel is dropped.

**What if I can’t find Speed Up/Cancel?**  
Edge exposes these actions on **pending** tx detail screens. If you don’t see them, the tx may already be confirmed or the network/RPC doesn’t allow replacement of that tx type.

---

# Best practices

-   Set fees based on **current** network conditions; avoid the “Low” preset when time-sensitive.
    
-   Keep a small buffer of the **native gas token** in your wallet.
    
-   For power users: monitor your account **nonce** and mempool status on a block explorer.
    

---

If you hit a wall, share your **transaction hash** and the chain with Support—our team can confirm status, advise exact fee targets, and help you clear a stuck nonce safely.
