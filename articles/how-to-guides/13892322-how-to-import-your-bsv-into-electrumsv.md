---
title: How to import your BSV into ElectrumSV
intercom_id: '13892322'
workspace_id: ourx4xix
state: published
default_locale: en
parent_type: null
parent_id: null
updated_at: 1772222699
description: >-
  BitcoinSV wallet status: *deprecated*

  Edge accounts can no longer synchronize with the BSV blockchain. The BSV node
  operator that allowed ...
url: >-
  https://support.edge.app/en/articles/13892322-how-to-import-your-bsv-into-electrumsv
---
# BitcoinSV wallet status: \*deprecated\*

Edge accounts can no longer synchronize with the BSV blockchain. The BSV node operator that allowed our implementation to work went offline. We've not been able to find a long-term solution and had to make the hard call to end support for the BSV asset within Edge.

Your funds are safe! Edge is a self-custody wallet, which means **only you** can create access to your coins. Edge empowers you to "hold your own keys," so you can create access to your coins at any time by exporting your private key/seed phrase into an operational client. Our top recommendation would be ElectrumSV to access your coins and be able to send them to another BSV wallet.  
  
Note: If ElectrumSV doesn't work, you can try with another app. Follow this guide: [BSV Wallet Paused: How to export private seed and access your coins](https://support.edge.app/hc/en-us/articles/21985270263067-BSV-Wallet-Paused-How-to-export-private-seed-and-access-your-coins)  
  
​

# Exporting your BSV seed from Edge

1.  Login into Edge
    
2.  Tap assets in the bottom navigation bar
    
3.  Hold-down on your BSV wallet and select **Get** **Raw Keys** from the options
    
4.  Input your Password and safely write down your 24-word seed phrase
    
    -   Note if the "coinType" is something other than 236  
          
        ​
        

# Importing the wallet into ElectrumSV

1\. Download ElectrumSV to desktop (Windows or a Mac)  
[https://electrumsv.io/download.html](https://electrumsv.io/download.html)

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520743/c76df4d7895d4592bfbcda426b8c/20884997758107?expires=1775187900&signature=7e7d429551ea1cb65e03229ef2073574b097f499500dba31394ee27d232f74de&req=diEmFMx8nYZbWvMW1HO4zRQ%2B4PBFRX4EIuJqQQw59zK%2B3GHT7n6JyFd7tsTe%0ArnB7%0A)

2\. Open up the app and click the **Continue** button

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520773/664073fbbfbb56b8c437233e7b87/20884997761051?expires=1775187900&signature=fb54a53549306f442ac85f9d2700921319d876819f4e206c23af54035cc8f442&req=diEmFMx8nYZYWvMW1HO4zcziCGMfBK4qdUCam2PM%2B9X%2B3EzlG1T44%2FmKLUaU%0A64vT%0A)

3\. Select the option to **Create New Wallet** near the bottom

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520798/2fb4c13d378d8ab738d320a9ce49/20884997762843?expires=1775187900&signature=5dab357ee52fea697e0b8f05f131168a15b93d4b94dcc1bbc57d0d1995fb7d08&req=diEmFMx8nYZWUfMW1HO4zd6oXBodx%2FVzaxbA3l9webzqaXqG4d84VYz0ABkJ%0AbA0h%0A)

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520830/28009ff9f52f3e9c66008b9cdeba/20884997763099?expires=1775187900&signature=2040eee5ff4f6b77f96fb61aa18aeb04a317ed5cc6cabe2ea366b88a7a57b17f&req=diEmFMx8nYlcWfMW1HO4zWAMk4d%2BtWDv4tKDbCAwxVHxslp%2BnZL%2BDfbj%2BCEt%0A5JaD%0A)

4\. Set *(and don't forget!)* a wallet file name and Password for this wallet; press **OK**

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520856/efa1cf15ebb031ab42713e425691/20885017352347?expires=1775187900&signature=2ab001f27628b3a80f50d2a2f4aa704e46a3f0e86e792d93d46d74fb83b6172a&req=diEmFMx8nYlaX%2FMW1HO4zYOSjyBJKwnLO20%2FD3BMHFI%2BhlsDrNXUvIoVG2TF%0A3vcm%0A)

5\. In the top left corner, use the **Add Account** button

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520868/19c31a636c8a845e88a89b9d1492/20884997768731?expires=1775187900&signature=3a7b2a07411ef6ff3d51d5f28433ae76472fea5471a654c77d431083df363a8a&req=diEmFMx8nYlZUfMW1HO4zczPQrcKvNwocGy1aUzdNvw1ocs2U2n%2FeXXZEMa%2F%0A0bUF%0A)

6\. Now select the option to "**Import from text** (any seed phrase)..." and press **Continue**

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520901/ae2c4d8c51df3551483c2101ab55/20884997768859?expires=1775187900&signature=242b734c91f6c9d6b5fd22a6fd944436739a54a6960ec4d360b4d0945f7bb711&req=diEmFMx8nYhfWPMW1HO4zapgr1aNTEsKJP%2BON2RR85acDy2HdauGZPybE1sC%0Afd3w%0A)

7\. Enter in your 24-word private seed phrase from Edge, then click on **Customize\*** instead of Done -

**\*Important Step!!!  
**(do not click Done ...yet)

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520930/f75d395208a630d178aec056c1f9/20884997772059?expires=1775187900&signature=4e7a3450046b3bd7c99a63c7102a8a6c6630d4a5a6c8c49af21005a43efc5d27&req=diEmFMx8nYhcWfMW1HO4zVOJCrSJKS6%2BWt%2FHILZOHUcFN1TV3HRE4NQN6bKL%0ATsO%2F%0A)

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520949/f202aa10744eb0eed53ea551cd02/20885017413659?expires=1775187900&signature=f4341e0bbbd89c731771cf954e487c8f4fafbc95cb697898264caa666a466ccd&req=diEmFMx8nYhbUPMW1HO4zcCdYNnzS9uVPOUE1dDUtdShZQY0PjeIIWJLj2jk%0AqThY%0A)

8\. Next, modify the first 0 to 236, or whichever “coinType” number you found in the Raw Keys file for your BSV wallet in Edge. BSV's derivation path is typically **m/44'/236'/0'** - unless the wallet was originally for a different coin type.

*For example: If you split a BCH wallet to get initially create this BSV wallet, a derivation path with the BCH coin type (145) would be needed to derive the correct addresses for your coins (m/44'/145'/0')*

*Note: If any import failure occurs, try adding another **/0** to the end: **m/44'/236'/0'/0***

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112520988/692472d0d4c7e6e5db6860323ce7/20885017415067?expires=1775187900&signature=9e038deed49f63bb4a0fa8b810b89cb1ff23d531f618cf27487a11a1664a9f3d&req=diEmFMx8nYhXUfMW1HO4zeBkAq0M6xcHkIZFx02kshLTTvnF9jDEglkICel8%0AQctC%0A)

9\. Enter your Password (from Step 4) and click **OK** to finish importing the wallet

![](https://edge-1a5ed69e1271.intercom-attachments-7.com/i/o/ourx4xix/2112521011/29f3ecca8541028622a4746c2f7e/20884997779099?expires=1775187900&signature=7bb178e671804608a496344ef3e6e92518a62f6b7e708f39c4fc9e82312448ec&req=diEmFMx8nIFeWPMW1HO4zUKi4bm0BaWSydkaqGQ7jnzdg3rwsuEubSX6FX43%0A85KD%0A)

At the bottom of the app, your current BSV balance should appear immediately! 🎉

You may now send your BSV to any other BSV wallet. If you want to trade or sell it, you may contact our support team to request access to our internal exchanges to use directly from ElectrumSV.
