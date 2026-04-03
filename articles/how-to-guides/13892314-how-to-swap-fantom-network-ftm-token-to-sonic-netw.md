---
title: How to Swap Fantom Network FTM Token to Sonic Network S Token on Edge Wallet
intercom_id: '13892314'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222685
description: >-
  Swapping Fantom to Sonic on Edge isn’t a simple one-step exchange—it actually
  bridges tokens between networks. To ensure the swap works, y...
url: >-
  https://support.edge.app/en/articles/13892314-how-to-swap-fantom-network-ftm-token-to-sonic-network-s-token-on-edge-wallet
---
Swapping Fantom to Sonic on Edge isn’t a simple one-step exchange—it actually bridges tokens between networks. To ensure the swap works, you must split your FTM Wallet into a Sonic variant so that both “FTM” and “Sonic” reside under the same address. Below is a streamlined guide to get you through the process.

---

# Prerequisites

1.  **Edge App Version**  
    Ensure you’re running the latest version of Edge Wallet (iOS/Android).
    
2.  **FTM Balance**  
    • You must have **at least 1 FTM** in your wallet.  
    • FTM balance should be in the wallet you plan to split.
    
3.  **Turn On Fant­om/Sonic Upgrade Plugin**  
    • Open Edge and tap the **☰ Side Menu** (upper-right).  
    • Go to **Settings → Exchange Settings**.  
    • Toggle **Fant­om/Sonic Upgrade** to **On**.
    

---

# Step 1: Split FTM into Sonic

1.  **Navigate to Your FTM Wallet**  
    • Tap **Assets** at the bottom.  
    • Find and tap **FTM** in the asset list.
    
2.  **Access the Split Menu**  
    • In your FTM wallet view, tap the **⋮ (three vertical dots)** in the upper-right corner.  
    • Choose **Split Wallet** from the menu.
    
3.  **Choose Sonic**  
    • When prompted, select **Sonic** as the token to split into.  
    • Tap **Confirm**.
    
    After confirmation, Edge creates a new **Sonic** wallet automatically—this wallet’s address matches your FTM wallet address (i.e., it’s derived from the same keypair).
    

---

# Step 2: Perform the Swap (Bridge)

1.  **Go to the Exchange Screen**  
    • Tap **Exchange** from the bottom navigation bar.
    
2.  **Set Up Source and Receiving Wallets**  
    • **Source Wallet**: Select the original **FTM** wallet that held your funds.  
    • **Receiving Wallet**: **Must** select the **newly created Sonic** wallet (the one you just split).
    
    If you pick a different Sonic wallet (not the one created via “Split”), you’ll see an error:  
    “No enabled exchanges support this token.”
    
3.  **Enter the Amount**  
    • Specify how many FTM you want to bridge into Sonic (minimum 1 FTM).  
    • Edge will display fees and the estimated Sonic amount you’ll receive.
    
4.  **Review and Confirm**  
    • Double-check that **Source = FTM wallet** and **Destination = Sonic wallet**.  
    • Tap **Review Swap**.  
    • If everything looks correct, tap **Confirm**.
    

Edge will broadcast the bridging transaction. After a short wait, your Sonic wallet balance will update.

---

# Troubleshooting Tips

-   **“No enabled exchanges support this token” Error**  
    • Verify that you’re using the **exact** Sonic wallet created during the Split step.  
    • If you don’t see the Sonic wallet under Assets, make sure the Fant­om/Sonic Upgrade plugin is still enabled (Side Menu → Settings → Exchange Settings).
    
-   **Insufficient Balance to Split**  
    • You need at least **1 FTM** in the FTM wallet to perform a Split.  
    • If you have only fractional FTM (e.g., 0.5 FTM), you’ll need to deposit more or convert from another token first.
    
-   **Swap Amount Below Minimum**  
    • The swap requires ≥ 1 FTM. If you enter less, the app will prompt you to increase the amount.
    
-   **Pending/Suspended Transactions**  
    • Wait a few minutes for the blockchain to confirm.  
    • If the transaction remains pending for more than 10 minutes, check network status or view details in your FTM wallet’s transaction history.
    

---
