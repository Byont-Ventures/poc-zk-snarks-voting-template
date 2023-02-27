import type { NextPage } from 'next';
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
import { BigNumber, utils, ethers } from 'ethers';
import { SemaphoreVotingAbi } from '../abis/SemaphoreVoting';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Identity } from '@semaphore-protocol/identity';
import { useContract, useSigner } from 'wagmi';

const Coordinator: NextPage = () => {
  const router = useRouter();

  //   const {
  //     query: { walletSigner },
  //   } = router;

  //   const props = {
  //     walletSigner,
  //   };

  //SEMAPHORE STUFF
  const [identity, setIdentity] = useState<Identity>();

  const [semaphoreProof, setSemaphoreProof] = useState('');

  const externalNullifier = utils.formatBytes32String('Topic');
  const snarkArtifactsPath = 'zkproof/../../artifacts/snark';

  //For creating pool
  const [pollId, setPollId] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );
  //   const [coordinator, setCoordinator] = useState<`0x${string}` | undefined>();
  const [merkleTreeDepth, setMerkleTreeDepth] = useState<
    BigNumber | undefined
  >();

  //Alerts
  const [successfulAlert, setSuccessfulAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);

  //Signer
  const { data: signer, isError, isLoading } = useSigner();

  //SemaphoreVote Smart Contract
  const contract = useContract({
    address: '0x41A1B6E666267e7C67A79cdFcD1a3Dcb976Ee8E5',
    abi: SemaphoreVotingAbi,
    signerOrProvider: signer,
  });

  const goToHomePage = () => {
    router.push('/');
  };

  const createBallout = async () => {
    if (!contract) {
      console.error('Smart contract is not loaded');
      return;
    }

    if (!pollId || !merkleTreeDepth) {
      console.error('Poll ID or Merkle tree depth is missing');
      return;
    }

    setLoadingAlert(true);

    try {
      const coordinator = signer?.getAddress();
      const myGasLimit = BigNumber.from(5000000);
      console.log(coordinator);
      let result = await contract.createPoll(
        pollId,
        coordinator,
        merkleTreeDepth,
        { gasLimit: myGasLimit }
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
      console.error('Error creating poll:', error);
      setLoadingAlert(false);
      setErrorAlert(true);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    }
  };

  const startBallout = async () => {
    setLoadingAlert(true);
    try {
      const myGasLimit = BigNumber.from(5000000);
      const encryptionKey = BigNumber.from(123456789);
      let result = await contract.startPoll(pollId, encryptionKey, {
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
      console.error('Error starting poll:', error);
      setLoadingAlert(false);
      setErrorAlert(true);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    }
  };

  const stopBallout = async () => {
    setLoadingAlert(true);
    try {
      const myGasLimit = BigNumber.from(5000000);
      const encryptionKey = BigNumber.from(123456789);
      let result = await contract.endPoll(pollId, encryptionKey, {
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
      console.error('Error ending poll:', error);
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
        className={
          'relative flex flex-col flex-grow mt-4 mb-8 space-y-8 md:space-y-16 md:mt-8 md:mb-16'
        }
      >
        {/* <Section> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            // flexDirection: 'column',
          }}
        >
          <Box boxSize="750px">
            <Flex justifyContent="center" flexDirection="column">
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={goToHomePage}
                marginBottom="16px"
              >
                Back
              </Button>
              <ConnectButton />
              <Heading size={'xl'} marginTop="50px" marginBottom="20px">
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
              <Input
                id="outlined-basic"
                placeholder="Set Ballot Id dont use the same one"
                type="number"
                onChange={(e) => setPollId(BigNumber.from(e.target.value))}
                errorBorderColor="red.300"
                style={{ marginBottom: '8px' }}
              />
              <Input
                id="outlined-basic"
                placeholder="Ballot Size Minimum 16"
                type="number"
                onChange={(e) =>
                  setMerkleTreeDepth(BigNumber.from(e.target.value))
                }
                errorBorderColor="red.300"
                style={{ marginBottom: '8px' }}
              />
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={createBallout}
                marginBottom="16px"
              >
                Create a Ballout
              </Button>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={startBallout}
                marginBottom="16px"
              >
                Start a Ballout
              </Button>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                onClick={stopBallout}
                marginBottom="16px"
              >
                Stop a Ballout
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

            <footer>
              <Text>Byont Ventures B.V. © {new Date().getFullYear()}</Text>
            </footer>
          </Box>
        </Box>
        {/* </Section> */}
      </main>
    </>
  );
};

export default Coordinator;