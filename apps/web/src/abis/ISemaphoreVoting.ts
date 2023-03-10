export const ISemaphoreVotingAbi = [
  {
    inputs: [],
    name: 'Semaphore__CallerIsNotThePollCoordinator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__MerkleTreeDepthIsNotSupported',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__PollHasAlreadyBeenStarted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__PollIsNotOngoing',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__YouAreUsingTheSameNillifierTwice',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'coordinator',
        type: 'address',
      },
    ],
    name: 'PollCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'coordinator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'decryptionKey',
        type: 'uint256',
      },
    ],
    name: 'PollEnded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'coordinator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'encryptionKey',
        type: 'uint256',
      },
    ],
    name: 'PollStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vote',
        type: 'uint256',
      },
    ],
    name: 'VoteAdded',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'identityCommitment',
        type: 'uint256',
      },
    ],
    name: 'addVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vote',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nullifierHash',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[8]',
        name: 'proof',
        type: 'uint256[8]',
      },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'coordinator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'merkleTreeDepth',
        type: 'uint256',
      },
    ],
    name: 'createPoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'decryptionKey',
        type: 'uint256',
      },
    ],
    name: 'endPoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pollId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'encryptionKey',
        type: 'uint256',
      },
    ],
    name: 'startPoll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
