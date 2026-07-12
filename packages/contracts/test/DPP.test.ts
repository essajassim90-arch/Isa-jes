import { expect } from 'chai'
import { ethers } from 'hardhat'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'

describe('DPP', () => {
  it('creates and reads a passport', async () => {
    const [owner] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-1')
    await expect(contract.createPassport(passportId, 'batch-001', 'Coffee Beans', 'UG'))
      .to.emit(contract, 'PassportCreated')
      .withArgs(passportId, 'batch-001', owner.address, 'Coffee Beans', 'UG', anyValue)

    const passport = await contract.getPassport(passportId)
    expect(passport.batchId).to.equal('batch-001')
    expect(passport.product).to.equal('Coffee Beans')
    expect(passport.origin).to.equal('UG')
    expect(passport.owner).to.equal(owner.address)
    expect(passport.active).to.equal(true)
  })

  it('updates passport status', async () => {
    const [owner, updater] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-2')
    await contract.createPassport(passportId, 'batch-002', 'Mangoes', 'KE')
    await expect(contract.connect(updater).setPassportStatus(passportId, false))
      .to.emit(contract, 'PassportStatusUpdated')
      .withArgs(passportId, updater.address, true, false, anyValue)

    const passport = await contract.getPassport(passportId)
    expect(passport.active).to.equal(false)
    expect(passport.owner).to.equal(owner.address)
  })

  it('prevents duplicate passport creation', async () => {
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-duplicate')
    await contract.createPassport(passportId, 'batch-dup', 'Tea', 'IN')
    await expect(contract.createPassport(passportId, 'batch-dup', 'Tea', 'IN')).to.be.revertedWithCustomError(
      contract,
      'PassportAlreadyExists',
    )
  })

  it('emits metadata, certification, event, ownership transfer and deactivation events', async () => {
    const [owner, nextOwner] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-events')
    const fieldMask = ethers.id('metadata.core')
    const certType = ethers.id('cert.organic')
    const eventType = ethers.id('event.transit')
    const reasonCode = ethers.id('reason.recalled')

    await contract.createPassport(passportId, 'batch-003', 'Cocoa', 'GH')

    await expect(contract.updatePassportMetadata(passportId, fieldMask, 'ipfs://metadata-hash'))
      .to.emit(contract, 'PassportMetadataUpdated')
      .withArgs(passportId, fieldMask, owner.address, 'ipfs://metadata-hash', anyValue)

    await expect(
      contract.attachPassportCertification(passportId, certType, 'ipfs://cert-hash', 1700000000, 1800000000),
    )
      .to.emit(contract, 'PassportCertificationAttached')
      .withArgs(passportId, certType, owner.address, 'ipfs://cert-hash', 1700000000, 1800000000)

    await expect(
      contract.recordPassportEvent(passportId, eventType, owner.address, 'WH-01', 1700100000, 'ipfs://payload-hash'),
    )
      .to.emit(contract, 'PassportEventRecorded')
      .withArgs(passportId, eventType, owner.address, 'WH-01', 1700100000, 'ipfs://payload-hash')

    await expect(contract.transferPassportOwnership(passportId, nextOwner.address))
      .to.emit(contract, 'PassportOwnershipTransferred')
      .withArgs(passportId, owner.address, nextOwner.address, anyValue)

    await expect(contract.connect(nextOwner).deactivatePassport(passportId, reasonCode))
      .to.emit(contract, 'PassportDeactivated')
      .withArgs(passportId, reasonCode, nextOwner.address, anyValue)

    await expect(contract.connect(nextOwner).deactivatePassport(passportId, reasonCode)).to.be.revertedWithCustomError(
      contract,
      'PassportAlreadyInactive',
    )

    const passport = await contract.getPassport(passportId)
    expect(passport.active).to.equal(false)
    expect(passport.owner).to.equal(nextOwner.address)
  })

  it('enforces ownership for metadata/event/certification/ownership transfer', async () => {
    const [owner, attacker] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-authz')
    await contract.createPassport(passportId, 'batch-004', 'Rice', 'VN')

    await expect(contract.connect(attacker).updatePassportMetadata(passportId, ethers.id('f'), 'hash')).to.be
      .revertedWithCustomError(contract, 'Unauthorized')
    await expect(
      contract.connect(attacker).attachPassportCertification(passportId, ethers.id('c'), 'hash', 1, 2),
    ).to.be.revertedWithCustomError(contract, 'Unauthorized')
    await expect(
      contract.connect(attacker).recordPassportEvent(passportId, ethers.id('e'), owner.address, 'L', 1, 'hash'),
    ).to.be.revertedWithCustomError(contract, 'Unauthorized')
    await expect(contract.connect(attacker).transferPassportOwnership(passportId, attacker.address)).to.be
      .revertedWithCustomError(contract, 'Unauthorized')
  })
})
