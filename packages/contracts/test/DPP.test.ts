import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('DPP', () => {
  it('creates and reads a passport', async () => {
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-1')
    await expect(contract.createPassport(passportId, 'batch-001', 'Coffee Beans', 'UG'))
      .to.emit(contract, 'PassportCreated')
      .withArgs(passportId, 'batch-001', 'Coffee Beans', 'UG')

    const passport = await contract.getPassport(passportId)
    expect(passport.batchId).to.equal('batch-001')
    expect(passport.product).to.equal('Coffee Beans')
    expect(passport.origin).to.equal('UG')
    expect(passport.active).to.equal(true)
  })

  it('updates passport status', async () => {
    const factory = await ethers.getContractFactory('DPP')
    const contract = await factory.deploy()

    const passportId = ethers.id('dpp-2')
    await contract.createPassport(passportId, 'batch-002', 'Mangoes', 'KE')
    await expect(contract.setPassportStatus(passportId, false))
      .to.emit(contract, 'PassportStatusUpdated')
      .withArgs(passportId, false)

    const passport = await contract.getPassport(passportId)
    expect(passport.active).to.equal(false)
  })
})
