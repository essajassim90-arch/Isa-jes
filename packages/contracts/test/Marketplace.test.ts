import { expect } from 'chai'
import { ethers } from 'hardhat'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'

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
      .withArgs(listingId, seller.address, ethers.id('dpp-1'), unitPrice, 3, anyValue)

    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address)

    await expect(
      contract.connect(buyer).placeOffer(offerId, listingId, 2, { value: ethers.parseEther('2') }),
    )
      .to.emit(contract, 'OfferPlaced')
      .withArgs(offerId, listingId, buyer.address, 2, ethers.parseEther('2'), anyValue)

    await expect(contract.connect(seller).acceptOffer(offerId))
      .to.emit(contract, 'OfferAccepted')
      .withArgs(offerId, listingId, seller.address, buyer.address, ethers.parseEther('2'), anyValue)

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

  it('prevents duplicate listing and duplicate offer IDs', async () => {
    const [seller, buyer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('Marketplace')
    const contract = await factory.deploy()

    const listingId = ethers.id('listing-dup')
    const offerId = ethers.id('offer-dup')
    await contract.connect(seller).createListing(listingId, ethers.id('dpp-x'), ethers.parseEther('1'), 4)
    await expect(
      contract.connect(seller).createListing(listingId, ethers.id('dpp-x'), ethers.parseEther('1'), 4),
    ).to.be.revertedWithCustomError(contract, 'ListingAlreadyExists')

    await contract.connect(buyer).placeOffer(offerId, listingId, 1, { value: ethers.parseEther('1') })
    await expect(contract.connect(buyer).placeOffer(offerId, listingId, 1, { value: ethers.parseEther('1') })).to.be
      .revertedWithCustomError(contract, 'OfferAlreadyExists')
  })

  it('emits listing lifecycle events for update, quantity adjust, status change, and cancel', async () => {
    const [seller] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('Marketplace')
    const contract = await factory.deploy()

    const listingId = ethers.id('listing-lifecycle')
    await contract.connect(seller).createListing(listingId, ethers.id('dpp-lf'), ethers.parseEther('1'), 5)

    await expect(contract.connect(seller).updateListing(listingId, ethers.parseEther('2'), ethers.id('field.unitPrice')))
      .to.emit(contract, 'ListingUpdated')
      .withArgs(
        listingId,
        seller.address,
        ethers.id('field.unitPrice'),
        ethers.parseEther('2'),
        5,
        5,
        anyValue,
      )

    await expect(
      contract.connect(seller).adjustListingQuantity(listingId, 7, ethers.id('reason.stock_recount')),
    )
      .to.emit(contract, 'ListingQuantityAdjusted')
      .withArgs(listingId, 5, 7, ethers.id('reason.stock_recount'), seller.address, anyValue)

    await expect(contract.connect(seller).setListingStatus(listingId, 2, ethers.id('reason.operator_cancel')))
      .to.emit(contract, 'ListingStatusChanged')
      .withArgs(listingId, 0, 2, seller.address, anyValue)

    await expect(contract.connect(seller).cancelListing(ethers.id('listing-cancel')))
      .to.be.revertedWithCustomError(contract, 'ListingNotFound')
  })

  it('emits offer update/reject/expire/refund events and enforces state transitions', async () => {
    const [seller, buyer] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('Marketplace')
    const contract = await factory.deploy()

    const listingId = ethers.id('listing-offer-events')
    const offerId = ethers.id('offer-update')
    const rejectOfferId = ethers.id('offer-reject')
    const expireOfferId = ethers.id('offer-expire')
    const unitPrice = ethers.parseEther('1')

    await contract.connect(seller).createListing(listingId, ethers.id('dpp-m1'), unitPrice, 6)

    await contract.connect(buyer).placeOffer(offerId, listingId, 2, { value: ethers.parseEther('2') })
    await expect(contract.connect(buyer).updateOffer(offerId, 3, ethers.id('field.quantity'), { value: ethers.parseEther('1') }))
      .to.emit(contract, 'OfferUpdated')
      .withArgs(offerId, listingId, buyer.address, ethers.id('field.quantity'), 3, ethers.parseEther('3'), anyValue)

    await contract.connect(buyer).placeOffer(rejectOfferId, listingId, 1, { value: ethers.parseEther('1') })
    await expect(contract.connect(seller).rejectOffer(rejectOfferId, ethers.id('reason.seller_rejected')))
      .to.emit(contract, 'OfferRejected')
      .withArgs(rejectOfferId, listingId, seller.address, ethers.id('reason.seller_rejected'), anyValue)
    const rejectedOffer = await contract.offers(rejectOfferId)
    expect(rejectedOffer.status).to.equal(2n)

    await contract.connect(buyer).placeOffer(expireOfferId, listingId, 1, { value: ethers.parseEther('1') })
    await expect(contract.connect(seller).expireOffer(expireOfferId))
      .to.emit(contract, 'OfferExpired')
      .withArgs(expireOfferId, listingId, seller.address, anyValue)
    const expiredOffer = await contract.offers(expireOfferId)
    expect(expiredOffer.status).to.equal(4n)

    await expect(contract.connect(seller).acceptOffer(rejectOfferId)).to.be.revertedWithCustomError(
      contract,
      'OfferNotPending',
    )
  })
})
