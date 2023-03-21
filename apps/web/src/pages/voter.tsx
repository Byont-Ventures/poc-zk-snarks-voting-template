import type { NextPage } from 'next';
import { useQuery, gql } from '@apollo/client';
import { SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  Text,
  Box,
  Heading,
  Button,
  Input,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useContract, useSigner, useContractEvent } from 'wagmi';
import { BigNumber, utils } from 'ethers';
import { SemaphoreVotingAbi } from '../abis/SemaphoreVoting';
import { Identity } from '@semaphore-protocol/identity';
import {
  FullProof,
  generateProof,
  verifyProof,
} from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';
import { PollCard } from '../components/PollCard';

const POLLS_QUERY = gql`
  query GetAllPolls {
    polls {
      id
      title
      description
      votingOptions {
        id
        value
      }
    }
  }
`;
const Voter: NextPage = () => {
  const router = useRouter();
  //SEMAPHORE STUFF
  const [identity, setIdentity] = useState<Identity>();
  const [vote, setVote] = useState<BigNumber | undefined>(BigNumber.from(0));
  //For joining pool
  const [pollId, setPollId] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );
  const [merkleTreeDepth, setMerkleTreeDepth] = useState<
    BigNumber | undefined
  >();
  const [group, setGroup] = useState<Group | undefined>();
  const [fullProof, setFullProof] = useState<FullProof>();

  //Alerts
  const [successfulAlert, setSuccessfulAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);

  //Smart Contract Signer
  const { data: signer, isError, isLoading } = useSigner();

  //Get all polls
  const { data: pollData, loading, error } = useQuery(POLLS_QUERY);

  //SemaphoreVote Smart Contract
  const contract = useContract({
    address: '0x7d685063b214f6b75CD6E3d896dc60759b950E0B',
    abi: SemaphoreVotingAbi,
    signerOrProvider: signer,
  });

  const contractEvent =
    contract &&
    useContractEvent({
      address: '0x7d685063b214f6b75CD6E3d896dc60759b950E0B',
      abi: SemaphoreVotingAbi,
      eventName: 'VoteAdded',
      listener(pollId, vote, merkleTreeRoot, merkleTreeDepth) {
        console.log('Event listener triggered');
        console.log(
          pollId.toString(),
          vote.toString(),
          merkleTreeRoot.toString(),
          merkleTreeDepth.toString()
        );
      },
    });

  const contractEvent2 =
    contract &&
    useContractEvent({
      address: '0x7d685063b214f6b75CD6E3d896dc60759b950E0B',
      abi: SemaphoreVotingAbi,
      eventName: 'MemberAdded',
      listener(groupId, index, identityCommitment, merkleTreeRoot) {
        console.log('Member Event listener triggered');
        console.log(
          groupId.toString(),
          index.toString(),
          identityCommitment.toString(),
          merkleTreeRoot.toString()
        );
      },
    });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { polls } = pollData;

  const goToHomePage = () => {
    router.push('/');
  };

  const createIdentity = () => {
    const _identity = new Identity();
    setIdentity(_identity);
    console.log(_identity.commitment);
  };

  const joinBallout = async () => {
    if (!contract) {
      console.error('Smart contract is not loaded');
      return;
    }

    if (!pollId) {
      console.error('Poll ID is missing');
      return;
    }

    setLoadingAlert(true);

    console.log(identity.commitment);

    console.log(`pollID on Joining Ballot: ${pollId}`);

    // await createNewGroup();
    // await makeVoteProof();

    try {
      const myGasLimit = BigNumber.from(5000000);
      let result = await contract.addVoter(pollId, identity?.commitment, {
        gasLimit: myGasLimit,
      });

      const receipt = await result.wait();

      if (receipt.status === 1) {
        setLoadingAlert(false);
        setSuccessfulAlert(true);
        setTimeout(() => {
          setSuccessfulAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error joining ballout:', error);
      setLoadingAlert(false);
      setErrorAlert(true);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    }
  };

  const createNewGroup = async () => {
    const newGroup = new Group(pollId.toNumber(), merkleTreeDepth.toNumber());
    setGroup(newGroup);
  };

  const makeVoteProof = async () => {
    console.log('Making vote proof');
    console.log(`Group members: ${group.members}`);
    console.log(`Group root: ${group.root}`);
    group.addMember(identity.commitment);
    console.log(`Group members: ${group.members}`);
    console.log(`Group root: ${group.root}`);

    const proof = await generateProof(identity, group, pollId, vote);
    setFullProof(proof);
    console.log(proof);
  };

  const verifyVoteProof = async () => {
    console.log(group);
    console.log(group.root);
    let result = await verifyProof(fullProof, merkleTreeDepth.toNumber());
    console.log(result);
    const proofArray = fullProof.proof.map(
      (value: BigNumber | string | number | null | undefined | BN) => value
    );
    console.log(proofArray);
  };

  const postVote = async () => {
    if (!contract) {
      console.error('Smart contract is not loaded');
      return;
    }
    if (!pollId) {
      console.error('Poll ID is missing');
      return;
    }
    setLoadingAlert(true);

    const proofArray = fullProof.proof.map(
      (value: BigNumber | string | number | null | undefined | BN) => value
    );
    console.log(proofArray);

    console.log(`vote on postVote: ${vote}`);
    console.log(`pollID on postVote: ${pollId}`);
    console.log(`group.root on postVote: ${group.root}`);

    try {
      const myGasLimit = BigNumber.from(5000000);
      const nullifierHash = BigNumber.from(fullProof.nullifierHash);
      console.log(nullifierHash);
      let result = await contract.castVote(
        vote,
        nullifierHash,
        pollId,
        proofArray,
        group.root,
        {
          gasLimit: myGasLimit,
        }
      );
      const receipt = await result.wait();
      if (receipt.status === 1) {
        setLoadingAlert(false);
        setSuccessfulAlert(true);
        setTimeout(() => {
          setSuccessfulAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error voting:', error);
      setLoadingAlert(false);
      setErrorAlert(true);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    }
  };

  return (
    <>
      <main
        data-testid="Layout"
        id="maincontent"
        className="flex flex-col items-center justify-center flex-grow mt-4 mb-8 space-y-8 md:space-y-16 md:mt-8 md:mb-16"
      >
        {/* <Section> */}
        <Box maxW="xl" w="full" p="6" rounded="lg" shadow="md">
          <Flex flexDir="column" alignItems="center">
            <Button
              variant="solid"
              bg="black"
              _hover={{ bg: 'gray.600' }}
              color="white"
              onClick={goToHomePage}
              mb="4"
              alignSelf="flex-start"
            >
              Back
            </Button>
            <Heading size="xl" mt="8" mb="4">
              Create an Identity
            </Heading>
            {identity ? (
              <Box py="6" whiteSpace="nowrap">
                <Box
                  p="5"
                  borderWidth={1}
                  borderColor="gray.500"
                  borderRadius="4px"
                >
                  <Text textOverflow="ellipsis" overflow="hidden">
                    Trapdoor: {identity.trapdoor.toString()}
                  </Text>
                  <Text textOverflow="ellipsis" overflow="hidden">
                    Nullifier: {identity.nullifier.toString()}
                  </Text>
                  <Text textOverflow="ellipsis" overflow="hidden">
                    Commitment: {identity.commitment.toString()}
                  </Text>
                </Box>
              </Box>
            ) : (
              <div></div>
            )}
            <Button
              variant="solid"
              bg="black"
              _hover={{ bg: 'gray.600' }}
              color="white"
              onClick={createIdentity}
              mr={[0, '4']}
              mb={['4', 4]}
              w={['full', 'auto']}
            >
              Create an Identity
            </Button>
            <Input
              id="outlined-basic"
              placeholder="Ballot Id"
              type="number"
              onChange={(e) => setPollId(BigNumber.from(e.target.value))}
              errorBorderColor="red.300"
              style={{ marginBottom: '8px' }}
            />
            <Input
              id="outlined-basic"
              placeholder="Merkle Tree Depth"
              type="number"
              onChange={(e) =>
                setMerkleTreeDepth(BigNumber.from(e.target.value))
              }
              errorBorderColor="red.300"
              style={{ marginBottom: '8px' }}
            />
            <Flex flexDir={['column', 'row']} mb="4">
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={joinBallout}
                mr={[0, '4']}
                mb={['4', 0]}
                w={['full', 'auto']}
              >
                Join a Ballout On-Chain
              </Button>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={createNewGroup}
                mr={[0, '4']}
                mb={['4', 0]}
                w={['full', 'auto']}
              >
                Create a Group Off-Chain
              </Button>
            </Flex>
            <Input
              id="outlined-basic"
              placeholder="Enter Your Vote"
              type="number"
              onChange={(e) => setVote(BigNumber.from(e.target.value))}
              errorBorderColor="red.300"
              style={{ marginBottom: '8px' }}
            />
            <Flex flexDir={['column', 'row']} mb="4">
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={makeVoteProof}
                mr={[0, '4']}
                mb={['4', 0]}
                w={['full', 'auto']}
              >
                Generate Proof
              </Button>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={verifyVoteProof}
                mr={[0, '4']}
                mb={['4', 0]}
                w={['full', 'auto']}
              >
                Verify Proof
              </Button>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={postVote}
                mr={[0, '4']}
                mb={['4', 0]}
                w={['full', 'auto']}
              >
                Vote
              </Button>
            </Flex>
            {successfulAlert && (
              <Alert status="success" variant="subtle">
                <AlertIcon />
                <AlertDescription>Successful Transaction!</AlertDescription>
              </Alert>
            )}
            {errorAlert && (
              <Alert status="error" variant="subtle">
                <AlertIcon />
                <AlertDescription>Failed Transaction!</AlertDescription>
              </Alert>
            )}
            {loadingAlert && <Spinner />}
          </Flex>
        </Box>
        <SimpleGrid columns={[1, 2, 3]} spacing="8">
          {polls.map(
            (poll) =>
              identity && (
                <PollCard
                  key={poll.id}
                  title={poll.title}
                  description={poll.description}
                  votingOptions={poll.votingOptions}
                  pollId={poll.id}
                  identityCommitment={identity.commitment}
                />
              )
          )}
        </SimpleGrid>
        {/* </Section> */}
      </main>
    </>
  );
};

export default Voter;
