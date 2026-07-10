// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DPP {
    struct Passport {
        string batchId;
        string product;
        string origin;
        bool active;
        uint256 createdAt;
    }

    mapping(bytes32 => Passport) private passports;

    event PassportCreated(bytes32 indexed passportId, string batchId, string product, string origin);
    event PassportStatusUpdated(bytes32 indexed passportId, bool active);

    error PassportAlreadyExists(bytes32 passportId);
    error PassportNotFound(bytes32 passportId);

    function createPassport(
        bytes32 passportId,
        string calldata batchId,
        string calldata product,
        string calldata origin
    ) external {
        if (passports[passportId].createdAt != 0) {
            revert PassportAlreadyExists(passportId);
        }

        passports[passportId] = Passport({
            batchId: batchId,
            product: product,
            origin: origin,
            active: true,
            createdAt: block.timestamp
        });

        emit PassportCreated(passportId, batchId, product, origin);
    }

    function setPassportStatus(bytes32 passportId, bool active) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }

        passport.active = active;
        emit PassportStatusUpdated(passportId, active);
    }

    function getPassport(bytes32 passportId) external view returns (Passport memory) {
        Passport memory passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }

        return passport;
    }
}
