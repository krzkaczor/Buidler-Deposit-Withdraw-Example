"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var setup_1 = require("../setup");
/* External Imports */
var hardhat_1 = require("hardhat");
var ovm_toolchain_1 = require("@eth-optimism/ovm-toolchain");
/* Internal Imports */
//import { increaseEthTime } from '../helpers'
//TODO: add in delays
var l1ToL2MessageDelay = 0; //5 * 60 //5 minutes
var l2ToL1MessageDelay = 0; //60 * 60 * 24 * 7 //1 week
describe('EOA L1 <-> L2 Message Passing', function () {
    var AliceL1Wallet;
    var BobL1Wallet;
    var MalloryL1Wallet;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), AliceL1Wallet = _a[0], BobL1Wallet = _a[1], MalloryL1Wallet = _a[2];
                    return [2 /*return*/];
            }
        });
    }); });
    var signer;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    signer = (_a.sent())[0];
                    return [2 /*return*/];
            }
        });
    }); });
    var L1_CrossDomainMessenger;
    var L2_CrossDomainMessenger;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var messengers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ovm_toolchain_1.initCrossDomainMessengers(l1ToL2MessageDelay, l2ToL1MessageDelay, hardhat_1.ethers, signer)];
                case 1:
                    messengers = _a.sent();
                    L1_CrossDomainMessenger = messengers.l1CrossDomainMessenger;
                    L2_CrossDomainMessenger = messengers.l2CrossDomainMessenger;
                    return [2 /*return*/];
            }
        });
    }); });
    var ERC20Factory;
    var L2ERC20Factory;
    var L1ERC20DepositFactory;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('ERC20')];
                case 1:
                    ERC20Factory = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('L2ERC20')];
                case 2:
                    L2ERC20Factory = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('L1ERC20Deposit')];
                case 3:
                    L1ERC20DepositFactory = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var L1ERC20;
    var L2ERC20;
    var L1ERC20Deposit;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ERC20Factory.deploy(10000, 'TEST TOKEN', 0, 'TEST')];
                case 1:
                    L1ERC20 = _a.sent();
                    return [4 /*yield*/, L2ERC20Factory.deploy('TEST TOKEN', 0, 'TEST')];
                case 2:
                    L2ERC20 = _a.sent();
                    return [4 /*yield*/, L1ERC20DepositFactory.deploy(L1ERC20.address, L2ERC20.address, L1_CrossDomainMessenger.address)];
                case 3:
                    L1ERC20Deposit = _a.sent();
                    L2ERC20.init(L2_CrossDomainMessenger.address, L1ERC20Deposit.address);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('deposit and withdrawal', function () {
        it('should allow an EOA to deposit and withdraw between one wallet', function () { return __awaiter(void 0, void 0, void 0, function () {
            var l2balance, _a, _b, l1balance, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _j.sent();
                        _b = (_a = L2ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 4: return [4 /*yield*/, _b.apply(_a, [_j.sent()])];
                    case 5:
                        l2balance = _j.sent();
                        _d = (_c = L1ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 6: return [4 /*yield*/, _d.apply(_c, [_j.sent()])];
                    case 7:
                        l1balance = _j.sent();
                        setup_1.expect(l2balance).to.be.equal(5000);
                        setup_1.expect(l1balance).to.be.equal(5000);
                        return [4 /*yield*/, L2ERC20.connect(AliceL1Wallet).withdraw(2000)
                            //await increaseEthTime(l1ToL2MessageDelay + 1)
                        ];
                    case 8:
                        _j.sent();
                        //await increaseEthTime(l1ToL2MessageDelay + 1)
                        return [4 /*yield*/, ovm_toolchain_1.relayL2ToL1Messages(signer)];
                    case 9:
                        //await increaseEthTime(l1ToL2MessageDelay + 1)
                        _j.sent();
                        _f = (_e = L2ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 10: return [4 /*yield*/, _f.apply(_e, [_j.sent()])];
                    case 11:
                        l2balance = _j.sent();
                        _h = (_g = L1ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 12: return [4 /*yield*/, _h.apply(_g, [_j.sent()])];
                    case 13:
                        l1balance = _j.sent();
                        setup_1.expect(l2balance).to.be.equal(3000);
                        setup_1.expect(l1balance).to.be.equal(7000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow an EOA to deposit and withdraw between two wallets', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
            return __generator(this, function (_0) {
                switch (_0.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _0.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _0.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _0.sent();
                        L2ERC20.transfer(BobL1Wallet.getAddress(), 2000);
                        _a = setup_1.expect;
                        _c = (_b = L2ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 4: return [4 /*yield*/, _c.apply(_b, [_0.sent()])];
                    case 5:
                        _a.apply(void 0, [_0.sent()]).to.be.equal(3000);
                        _d = setup_1.expect;
                        _f = (_e = L1ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 6: return [4 /*yield*/, _f.apply(_e, [_0.sent()])];
                    case 7:
                        _d.apply(void 0, [_0.sent()]).to.be.equal(5000);
                        _g = setup_1.expect;
                        _j = (_h = L2ERC20).balanceOf;
                        return [4 /*yield*/, BobL1Wallet.getAddress()];
                    case 8: return [4 /*yield*/, _j.apply(_h, [_0.sent()])];
                    case 9:
                        _g.apply(void 0, [_0.sent()]).to.be.equal(2000);
                        _k = setup_1.expect;
                        _m = (_l = L1ERC20).balanceOf;
                        return [4 /*yield*/, BobL1Wallet.getAddress()];
                    case 10: return [4 /*yield*/, _m.apply(_l, [_0.sent()])];
                    case 11:
                        _k.apply(void 0, [_0.sent()]).to.be.equal(0);
                        return [4 /*yield*/, L2ERC20.connect(BobL1Wallet).withdraw(1000)];
                    case 12:
                        _0.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL2ToL1Messages(signer)];
                    case 13:
                        _0.sent();
                        _o = setup_1.expect;
                        _q = (_p = L2ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 14: return [4 /*yield*/, _q.apply(_p, [_0.sent()])];
                    case 15:
                        _o.apply(void 0, [_0.sent()]).to.be.eq(3000);
                        _r = setup_1.expect;
                        _t = (_s = L1ERC20).balanceOf;
                        return [4 /*yield*/, AliceL1Wallet.getAddress()];
                    case 16: return [4 /*yield*/, _t.apply(_s, [_0.sent()])];
                    case 17:
                        _r.apply(void 0, [_0.sent()]).to.be.eq(5000);
                        _u = setup_1.expect;
                        _w = (_v = L2ERC20).balanceOf;
                        return [4 /*yield*/, BobL1Wallet.getAddress()];
                    case 18: return [4 /*yield*/, _w.apply(_v, [_0.sent()])];
                    case 19:
                        _u.apply(void 0, [_0.sent()]).to.be.eq(1000);
                        _x = setup_1.expect;
                        _z = (_y = L1ERC20).balanceOf;
                        return [4 /*yield*/, BobL1Wallet.getAddress()];
                    case 20: return [4 /*yield*/, _z.apply(_y, [_0.sent()])];
                    case 21:
                        _x.apply(void 0, [_0.sent()]).to.be.eq(1000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow Alice to withdraw transferred $', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _a.sent();
                        L2ERC20.transfer(BobL1Wallet.getAddress(), 5000);
                        return [4 /*yield*/, setup_1.expect(L2ERC20.connect(AliceL1Wallet).withdraw(2000)).to.be.revertedWith("Account doesn't have enough coins to burn")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow Bob to withdraw twice', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _a.sent();
                        L2ERC20.transfer(BobL1Wallet.getAddress(), 3000);
                        return [4 /*yield*/, L2ERC20.connect(BobL1Wallet).withdraw(3000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL2ToL1Messages(signer)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, setup_1.expect(L2ERC20.connect(BobL1Wallet).withdraw(3000)).to.be.revertedWith("Account doesn't have enough coins to burn")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow mallory to call withdraw', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, setup_1.expect(L2ERC20.connect(MalloryL1Wallet).withdraw(3000)).to.be.revertedWith("Account doesn't have enough coins to burn")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow mallory to mint infinite money', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, setup_1.expect(L2ERC20.mint(MalloryL1Wallet.getAddress(), 7000)).to.be.revertedWith("Only messages relayed by L2CrossDomainMessenger can mint")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow mallow to withdraw money that is not hers', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, L1ERC20.approve(L1ERC20Deposit.address, 5000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL1ToL2Messages(signer)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, L2ERC20.withdraw(1000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, ovm_toolchain_1.relayL2ToL1Messages(signer)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, setup_1.expect(L1ERC20Deposit.withdraw(MalloryL1Wallet.getAddress(), 2000)).to.be.revertedWith("Only messages relayed by the L1CrossDomainMessenger can withdraw")];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
