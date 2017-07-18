Souq: Decentralized Project Tagging & Funding

[Souq](https://github.com/cryptocracy/souq) is a decentralized project tagging & funding app powered by blockchain technology.

### Target group
Souq is meant used by anyone with a `Project` that they think should be funded, and or anyone who wishes to support others `Projects`.
Users should not need to understand everything of the underlying technology, but if it matters they should
be able to comprehend why and how decentralized crowdfunding operates and why it is important for them and their communities.

### Problem to solve
Current crowdfunding has some flaws:
* `Projects` that properly qualify for funding are not able to receive it due to censorship.
* Capital is often insufficiently available to meet the stated objectives.
* Results aren't always publically available or open to public critique even though

### Goal
The goal is to enable users to easily create `Projects` that let other users easily find and fund. `Projects` are to be
verifiable & secured by a blockchain. Besides that, this software should solve the problems mentioned above.

### Minimal Viable Product (MVP)
* [x] Users are able to create `Projects` that have
	* [x] a title
	* [x] a description
	* [x] a payment address (other coming soon)
	* [x] a payment goal (amount desired in funding)
	* [x] a geolocation (latitude, longitude)
	* [x] a optional phone number
	* [x] a optional email address 
	* [x] a optional external url
* [ ] Users are able to manage their cryptocurrency like a wallet.
* [ ] Users are able to manage their owned `Projects`.
	* [ ] update data of a owned `Project`
	* [ ] transfer ownership of a owned `Project`
* [ ] Users are able to send cryptocurrency to the specified payment address of a discovered `Project`
* [ ] Users are able to search for 'Projects` by its unique ID, owner ID, keywords, and or location.
* [ ] Users are able to change ownership of their `Projects`

### Future features
* [ ] Users are able to Review a `Project` they have contributed funds to.
* [ ] Users are able to track the History of a `Project` (change log of Project zone file)

## Core components / Models
* [x] `Account` tab
	* [x] Configure Settings (Button top right)
		* [x] define the Path to preferred node, port number, and JWT secret
* [x] `Projects` tab
	* [x] Create new `Project` (Button top left)
		* [ ] define the `Project` data & details
	* [ ] View `Project`(s)
		* [ ] Get List of `Projects`: Inspect details of single `Project`(sortable by Distance, Total Goal, and % Funded)
			* [ ] Get `Project` details: View the various information  
				* [ ] Inspect its Details: Title, Description, Image, Payment Address, Goal Amount, Fund %, Location on Map, Phone, Email, URL
				* [ ] Inspect its Reviews (once feature is available)
				* [ ] Send cryptocurrency to the specified payment address of the `Project`


## User flow

### Setup Souq
* Alice and Bob both go through their initial Souq setup (install app, sync to Preferred server, deposit funds to their wallets)

### Create a Project
* Alice clicks `New Project` and fills out the form for creating a new `Project`
* Upon "Save Project", redirected to her `Account` tab, showing a pending registration at the bottom of the list of Owned `Projects`.
* The JSON object containing the respective data gets written into the zone file of Alice's new `Project` upon registration complete.
* Alice retrieves unique ID and shares it with other users.

### View a List of Projects
* Bob first gets a list of `Projects` by id, owner id, keyword(s), location, and or additional funding details.

#### Inspect a Individual Project
* Alice's `Project` catches Bob's eye in the list when searching for nearby `Projects`
	* Bob can click on her specific `Project` to inspect it
	* The `Project` details and their elements can be more carefully inspected.

#### Send Funds to Project
* If Alice's `Project` is a worthy cause, Bob is able to send funds to the specified payment address
	* Bob sees the goal amount
	* Bob sees the payment address
	* Bob can specify how much he would like to send
	* The transaction is executed upon confirmation

#### Audit Project History
* If Alice's `Project` has ever been updated, then Bob sees the changes in a clean log of historical changes to its zone file.
  * Bob sees when the goal payment address has changed, or other key details such as objective description changes.
