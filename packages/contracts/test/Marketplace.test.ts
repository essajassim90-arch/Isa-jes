import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Marketplace', () => {
  it('creates listing and settles accepted offer', async () => {
    const [seller, buyer] = await ethers.getSigners()

    const factory = await ethers.getContractFactory('Marketplace')
    const contract = await factory.deploy()

    const listingId = ethers.id('listing-1')
    const offerId = ethers.id('offer-1')
    const unitPrice = ethers.parseEther('1')

    await expect(contract.connect(seller).createListing(listingId, ethers.id('dpp-1'), unitPrice, 3))
      .to.emit(contract, 'ListingCreated')

    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address)

    await expect(
      contract.connect(buyer).placeOffer(offerId, listingId, 2, { value: ethers.parseEther('2') }),
    )
      .to.emit(contract, 'OfferPlaced')
      .withArgs(offerId, listingId, buyer.address, 2, ethers.parseEther('2'))

    await expect(contract.connect(seller).acceptOffer(offerId)).to.emit(contract, 'OfferAccepted')

    const listing = await contract.listings(listingId)
    expect(listing.availableQuantity).to.equal(1)

    const offer = await contract.offers(offerId)
    expect(offer.status).to.equal(1n)

    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address)
    expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore)
  })

  it('rejects offer with incorrect payment', async () => {
    const [seller, buyer] = await ethers.getSigners()

    const factory = await ethers.getContractFactory('Marketplace')
    const contract = await factory.deploy()

    const listingId = ethers.id('listing-2')
    await contract.connect(seller).createListing(listingId, ethers.id('dpp-2'), ethers.parseEther('1'), 5)

    await expect(
      contract.connect(buyer).placeOffer(ethers.id('offer-2'), listingId, 2, { value: ethers.parseEther('1') }),
    ).to.be.revertedWithCustomError(contract, 'IncorrectPayment')
  })
})
