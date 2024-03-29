export const ISemaphoreVotingAbi = [
  {
    inputs: [
      {
        internalType: 'contract ISemaphoreVerifier',
        name: '_verifier',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'Semaphore__CallerIsNotThePollCoordinator',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__GroupAlreadyExists',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Semaphore__GroupDoesNotExist',
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
        indexed: true,
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeDepth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'zeroValue',
        type: 'uint256',
      },
    ],
    name: 'GroupCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'identityCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeRoot',
        type: 'uint256',
      },
    ],
    name: 'MemberAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'identityCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeRoot',
        type: 'uint256',
      },
    ],
    name: 'MemberRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'identityCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newIdentityCommitment',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeRoot',
        type: 'uint256',
      },
    ],
    name: 'MemberUpdated',
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
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeDepth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'votingOptions',
        type: 'string[]',
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
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeRoot',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'merkleTreeDepth',
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
      {
        internalType: 'uint256',
        name: 'merkleTreeRoot',
        type: 'uint256',
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
      {
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string[]',
        name: 'votingOptions',
        type: 'string[]',
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
        name: 'groupId',
        type: 'uint256',
      },
    ],
    name: 'getMerkleTreeDepth',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
    ],
    name: 'getMerkleTreeRoot',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'groupId',
        type: 'uint256',
      },
    ],
    name: 'getNumberOfMerkleTreeLeaves',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
  {
    inputs: [],
    name: 'verifier',
    outputs: [
      {
        internalType: 'contract ISemaphoreVerifier',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
