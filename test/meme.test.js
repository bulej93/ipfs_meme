const meme =  artifacts.require("meme");

require("chai")
	.use(require("chai-as-promised"))
	.should()

contract('meme', (accounts) => {
	let Meme

	before(async() => {
		Meme = await meme.deployed()
	})

	describe('deployment', async () => {

		it('deploys succesfully', async () => {
		
		const address = Meme.address
		assert.notEqual(address, 0x0)
		assert.notEqual(address, '')
		assert.notEqual(address, null)
		assert.notEqual(address, undefined)
		})
	})

	describe('storage', async () => {
		it('updates the memeHash', async () => {
			let memeHash
			memeHash ='abc123'
			await Meme.set(memeHash)
			const result = await Meme.get()
			assert.equal(result, memeHash)
		})
	})
}) 