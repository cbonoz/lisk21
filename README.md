## LiskCollectible

Enables anyone to sell the rights to a group of documents or property as an ownable NFT backed by Lisk.

## Inspiration

There's been a lot of discussion around the value of NFT's and collecting/speculation purposes, but much less regarding NFTs for use in legal or digital content ownership.

For any new product, the associated intellectual property will often have been touched by many actors: founders; employees; contractors; educational institutions; government funding agencies; third party licensors of technology and IP rights; and customers, including those involved in beta testing and pre-launch activities. For each of these actors, there should be written agreements in place to cover moral rights, retention of rights to background technology, any restrictions on exploiting the IP, and the scope of the licenses that are granted. In addition, joint ownership creates special challenges.

For written or digital media, it can be difficult to prove the ownership of a particular idea. With LiskCollectible, an NFT can be generated at a particular point in time wrapping a collection of documents or media - whoever owns the NFT can demonstrate proof of ownership over such content.

### Running the project

This app uses Lisk (for NFT generation) and Textile (for IPFS hosting/bundling).
Textile hub key
Define `REACT_APP_TEXTILE_KEY=XXX` in your environment
`yarn && yarn start` for both the backend and front end.

## How we built it

- Reactjs based front end based using elements from the Lisk base NFT application.
- Textile: IPFS packaging of content and media files.
- Lisk: Backend for NFT issuance and enforcement.

## What we learned

- How to manage and create NFT's on Lisk
- Integrate Lisk with an IPFS use case.

## Testing / User Flow

- Start front end and back end projects.
- Click create account
- Send funds from genesis (note if the blockchain is restarted, you'll need to create a new account)
- Upload a new bundle of documents, note the information on the newly created listing.
- Return to the main marketplace home page - the NFT you created should be uploaded and available for purchase.
- Purchase the NFT, you should receive an access key.
- Enter the access key on the `Access` tab to receive an IPFS link to the purchased item/file collection.

### Screenshots

<h2>Discover NFT's</h2>
<img src="./img/0.png" width=800 />
<h2>Create new marketplace account (Lisk credentials)</h2>
<img src="./img/2.png" width=800 />
<h2>Purchase complete</h2>
<img src="./img/1.png" width=800 />
<h2>Access uploaded content</h2>
<img src="./img/4.png" width=800 />
<h2>Create new listing<h2>
<img src="./img/5.png" width=800 />
<h2>Access uploaded content</h2>
<img src="./img/3.png" width=800 />
