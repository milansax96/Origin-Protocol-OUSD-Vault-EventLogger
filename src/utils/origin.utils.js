import {ethers} from "ethers";

export const originContractAddress =
    '0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70';

export const provider = new ethers.providers.WebSocketProvider(
    'wss://eth-mainnet.g.alchemy.com/v2/9i2ngk67rsyMG58OBwc5-NLfpb-na5U_'
);

const originAbi = [
    'event AssetSupported(address _asset)',
    'event AssetDefaultStrategyUpdated(address _asset, address _strategy)',
    'event AssetAllocated(address _asset, address _strategy, uint256 _amount)',
    'event StrategyApproved(address _addr)',
    'event StrategyRemoved(address _addr)',
    'event Mint(address _addr, uint256 _value)',
    'event Redeem(address _addr, uint256 _value)',
    'event CapitalPaused()',
    'event CapitalUnpaused()',
    'event RebasePaused()',
    'event RebaseUnpaused()',
    'event VaultBufferUpdated(uint256 _vaultBuffer)',
    'event RedeemFeeUpdated(uint256 _redeemFeeBps)',
    'event PriceProviderUpdated(address _priceProvider)',
    'event AllocateThresholdUpdated(uint256 _threshold)',
    'event RebaseThresholdUpdated(uint256 _threshold)',
    'event StrategistUpdated(address _address)',
    'event MaxSupplyDiffChanged(uint256 maxSupplyDiff)',
    'event YieldDistribution(address _to, uint256 _yield, uint256 _fee)',
    'event TrusteeFeeBpsChanged(uint256 _basis)',
    'event TrusteeAddressChanged(address _address)',
    'event GovernorshipTransferred(address indexed previousGovernor, address indexed newGovernor)',
    'event Upgraded (address indexed implementation)'
];

export const dataGridColumns = [
    {
        field: 'blockNumber', headerName: 'Block Number', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'name', headerName: 'Event Name', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'signature', headerName: 'Event Signature', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'firstArgument', headerName: 'First Argument', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'secondArgument', headerName: 'Second Argument', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'thirdArgument', headerName: 'Third Argument', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'blockHash', headerName: 'Block Hash', headerClassName: 'blue-theme--header', width: 550
    },
    {
        field: 'topic', headerName: 'Topic', headerClassName: 'blue-theme--header', width: 550
    }
];

export const iface = new ethers.utils.Interface(originAbi);

export const parseArguments = (eventObject, args) => {
    if (!(args instanceof Array)) {
        return;
    }
    if (args.length >= 3) {
        eventObject.firstArgument = args[0];
        eventObject.secondArgument = args[1];
        eventObject.thirdArgument = args[2];
    } else if (args.length === 2) {
        eventObject.firstArgument = args[0];
        eventObject.secondArgument = args[1];
    } else if (args.length === 1) {
        eventObject.firstArgument = args[0];
    }
}

export const createEventObject = (log, event, counter) => {
    let eventObject = {
        id: counter,
        blockNumber: log.blockNumber,
        blockHash: log.blockHash,
        name: event.name,
        signature: event.signature,
        topic: event.topic
    }
    parseArguments(eventObject, event.args);
    return eventObject;
}