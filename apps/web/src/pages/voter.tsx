import type { NextPage } from 'next';
import { useQuery, gql } from '@apollo/client';
import { SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  Text,
  Box,
  Heading,
  Button,
  Highlight,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useContract, useSigner, useContractEvent } from 'wagmi';
import { BigNumber } from 'ethers';
import { SemaphoreVotingAbi } from '../abis/SemaphoreVoting';
import { Identity } from '@semaphore-protocol/identity';
import { FullProof, generateProof } from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';
import { PollCard } from '../components/PollCard';

const POLLS_QUERY = gql`
  query GetAllPolls {
    polls {
      id
      title
      description
      merkleTreeDepth
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
    address: '0x84c403687c0811899A97d358FDd6Ce7012B1e6C0',
    abi: SemaphoreVotingAbi,
    signerOrProvider: signer,
  });

  const contractEvent =
    contract &&
    useContractEvent({
      address: '0x84c403687c0811899A97d358FDd6Ce7012B1e6C0',
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
      address: '0x84c403687c0811899A97d358FDd6Ce7012B1e6C0',
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

  const createIdentity = async () => {
    const _identity = new Identity();
    setIdentity(_identity);
    console.log(_identity.commitment);
  };

  const createNewGroup = async () => {
    const newGroup = new Group(pollId.toNumber(), merkleTreeDepth.toNumber());
    setGroup(newGroup);
    return newGroup;
  };

  const makeVoteProof = async (newGroup) => {
    // console.log('Making vote proof');
    // console.log(`Group members: ${group.members}`);
    // console.log(`Group root: ${group.root}`);
    newGroup.addMember(identity.commitment);
    // console.log(`Group members: ${group.members}`);
    // console.log(`Group root: ${group.root}`);

    const proof = await generateProof(identity, newGroup, pollId, vote);
    setFullProof(proof);
    console.log(proof);
    return proof;
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

    const newGroup = await createNewGroup();
    const fullProof = await makeVoteProof(newGroup);

    const proofArray = fullProof.proof.map(
      (value: BigNumber | string | number | null | undefined | BN) => value
    );
    console.log(proofArray);

    console.log(`vote on postVote: ${vote}`);
    console.log(`pollID on postVote: ${pollId}`);
    console.log(`Group root on postVote: ${newGroup.root}`);

    try {
      const myGasLimit = BigNumber.from(5000000);
      const nullifierHash = BigNumber.from(fullProof.nullifierHash);
      console.log(nullifierHash);
      let result = await contract.castVote(
        vote,
        nullifierHash,
        pollId,
        proofArray,
        newGroup.root,
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
              <Box py="6">
                <Box
                  p="5"
                  borderWidth={1}
                  borderColor="gray.500"
                  borderRadius="4px"
                >
                  <Heading size="lg" lineHeight="tall">
                    <Text>Your Public Identity:</Text>
                    <Text
                      as="span"
                      px="2"
                      py="1"
                      borderRadius="full"
                      bg="teal.300"
                      fontWeight="bold"
                      wordBreak="break-word"
                      fontSize="xl"
                    >
                      {identity.commitment.toString()}
                    </Text>
                  </Heading>
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
              isDisabled={!signer}
            >
              Create an Identity
            </Button>
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
        <Heading size="xl" mt="8" mb="4">
          Ballots to vote on
        </Heading>
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
                  identity={identity}
                  merkleTreeDepth={poll.merkleTreeDepth}
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
