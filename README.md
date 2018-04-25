[Souq](https://github.com/cryptocracy/souq) Decentralized Project Tagging & Funding

### Target group
Souq is meant to be used by anyone with a `Project` they think should be funded, and or anyone who wants to support said `Projects`. We hope to have a wide variety of use cases.

### Problems to solve
Current online crowdfunding has some flaws:
* Crowdfunding apps like Kickstarter and Indigogo are centrally controlled and subject to censorship and favoritism.
* Crowdfunding apps do not faciliate funding of initiatives at local levels. 
* Funding is typically insufficiently available to meet the stated objectives due to lack of discovery by relavent would be backer(s).
* Results aren't always available to public critique.

### Goal
Solve the stated problems above by giving users the ability to easily create decentralized `Projects` that other users can easily find and fund. `Projects` are secured by Blockstack and the Bitcoin Blockchain. 

### Minimal Viable Product (MVP)
* [x] Users are able to create `Projects` that have
	* [x] Title
	* [x] Description
	* [X] Category (more coming)
	* [X] Type (more coming)
	* [ ] Status (almost done)
	* [x] Payment address
	* [x] Goal amount
	* [x] Coordinates (latitude, longitude)
	* [x] Image url
	* [x] Phone number
	* [x] Email address 
	* [x] External url
* [x] users are able to update data of a owned `Project`
* [x] Users are able to send cryptocurrency to the specified payment address of a discovered `Project`
* [x] Users are able to search for `Projects` by its Unique ID.
* [x] Users are able to search for `Projects` by relative Properties, ie keywords etc.
* [x] Users are able to search for `Projects` by relative Proximity to their current location. 
* [ ] Users are able to transfer ownership of a owned `Project` to another user.
* [ ] Users are able to search for `Projects` by relative Owner.

### Future features
* [ ] Users are able to `Review` a `Project` they have contributed funds to.
* [ ] Users are able to track the History of a `Project` (change log of Project zone file)
* [ ] `Project` owners are able to create delegatable `Tasks` to other Users that can be independently described & funded (sub domains)

## Core components / Models
* [ ] `Lock` - intial local application lock (not to be confused with your Blockstack Password)
* [x] `Account` tab
	* [x] Configure Settings (Button top right)
		* [x] Set the Preferred node Path, Port Number, and Secret
* [x] `Projects` tab
	* [x] Create new `Project` (Button top left)
		* [x] Save the `Project` data details by defining the various fields.
	* [x] View `Project`(s) (still being cleaned up)
		* [x] Get List of `Projects`: By ID, By Properties, or By Proximity
			* [x] Inspect `Project` details: View the various information  
				* [ ] Inspect its Details: 
					* [x] Title
					* [x] Description
					* [X] Category (more coming)
					* [X] Type (more coming)
					* [ ] Status (almost done)
					* [ ] Image URL (currently simple, needs Gaia integration)
					* [x] Payment Address QR Code
					* [X] Payment Address Button
					* [x] Goal Amount
					* [ ] Current % Funded
					* [x] Location on Map
					* [x] Phone Button
					* [x] Email Button
					* [x] External URL Button
				* [ ] Inspect its Reviews (once feature is available)
				* [ ] Send Cryptocurrency to the specified payment address of the `Project` via blockstack wallet.
				* [x] Send Cryptocurrency to the specified payment address of the `Project` via external Wallet
				* [ ] Send Cryptocurrency to the specified payment address of the `Project` via a ShapeShift


## User flow

### Setup Souq
* Alice and Bob both go through their initial Souq setup (Install/Setup Preferred Node, Install/Setup Mobile App, Funds Account)

### Create a Project
* Alice clicks `New Project` and fills out the form for creating a new `Project`
* Upon "Save Project", redirected to her `Account` tab, showing a pending registration at the bottom of the list of Owned `Projects`.
* The JSON object containing the respective data gets written into the zone file of Alice's new `Project` upon registration complete.
* Alice retrieves unique ID and shares it with other users.

### View a List of Projects
* Bob first gets a list of `Projects` by id, owner id, keyword(s), location, and or additional funding details.

#### Inspect a Individual Project
* Alice's `Project` catches Bob's eye in the list when searching for `Projects` by `Proximity`
	* Bob can click on her specific `Project` to inspect it
	* The `Project` details and their elements can be more carefully inspected.

#### Send Funds to Project
* If Alice's `Project` is a worthy cause, Bob is able to send funds to the specified payment address
	* Bob sees the goal amount
	* Bob sees the payment address qr code, upon click is presented with funding options (wallet select)
	* Bob can specify how much he would like to send
	* The transaction is executed upon confirmation

#### Audit Project History
* If Alice's `Project` has ever been updated, then Bob sees the changes in a clean log of historical changes to its zone file.
  * Bob sees when the goal payment address has changed, or other key details such as objective description changes.
