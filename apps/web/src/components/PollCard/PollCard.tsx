import React, { useState } from 'react';
import { Box, VStack, Text, RadioGroup, Radio, Button } from '@chakra-ui/react';

interface PollCardProps {
  title: string;
  description: string;
  votingOptions: string[];
  pollId: string;
  identityCommitment: string;
}

export const PollCard: React.FC<PollCardProps> = ({
  title,
  description,
  votingOptions,
  pollId,
  identityCommitment,
}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="4">
      <VStack align="start">
        <Text fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="md">{description}</Text>
        <RadioGroup value={selectedOption} onChange={handleChange}>
          {votingOptions.map((option, index) => {
            // console.log('Option:', option);
            // console.log(identityCommitment);
            return (
              <Radio key={`${pollId}-${index}`} value={index.toString()}>
                <Text>{option}</Text>
              </Radio>
            );
          })}
        </RadioGroup>
        <Button
          variant="solid"
          bg="black"
          _hover={{ bg: 'gray.600' }}
          color="white"
          // onClick={joinBallout}
          mr={[0, '4']}
          mb={['4', 0]}
          w={['full', 'auto']}
        >
          Join a Ballout On-Chain
        </Button>
      </VStack>
    </Box>
  );
};
