import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Text, Box, Button, Flex,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure } from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
  } from '@chakra-ui/icons';
import React, from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Home: NextPage = () => {
  const router = useRouter();

  const goToCoordinatorPage = () => {
    router.push('/coordinator');
  };

  const goToVoterPage = () => {
    router.push('/voter');
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <Box boxSize="750px">
            <Box textAlign="center">
              <Text
                as="h1"
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="bold"
                color={useColorModeValue('gray.700', 'gray.200')}
              >
                ZK Votely
              </Text>
              <Text
                as="p"
                fontSize={{ base: 'lg', md: 'xl' }}
                color={useColorModeValue('gray.500', 'gray.300')}
                mt={3}
              >
                ZK Votely is a voting platform based on zero-knowledge proofs technology. It is built using Next.js, TypeScript, Semaphore Protocol and Solidity.
              </Text>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
};

export default Home;
