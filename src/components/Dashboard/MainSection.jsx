import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  HStack,
  Box
} from '@chakra-ui/react';
import { PageSlideFade } from '../../animations/page-transitions';
import { Link } from 'react-router-dom';
import EmptyPageImage from '../../assets/images/EmptyNotesList.svg'

export default function MainSection() {
  return (
      <Flex position="fixed"
        left={'25vh'}
        right={0}
        bottom={0}
        top={0}
        alignItems="center"
        justifyContent="center"
        bg="white"
        zIndex={999}>
        <HStack>
          <Stack spacing={8}>
            <Box>
              <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text
                  as={'span'}
                  position={'relative'}
                  _after={{
                    content: "''",
                    width: 'full',
                    height: useBreakpointValue({ base: '20%', md: '30%' }),
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'blue.400',
                    zIndex: -1,
                  }}
                >
                  Hafiz Dairies
              </Text>
                <br />{' '}
                <Text color={'blue.400'} as={'span'}>
                  Point of sale
              </Text>{' '}
              </Heading>
              <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
                Manage your inventory and sale effeciently.
            </Text>
            </Box>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center">
              <Button
                as={Link}
                to="/stocks?type=Factory"
                rounded={'full'}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Stocks
              </Button>
              <Button as={Link}
                to="/vendors" rounded={'full'}>Vendors</Button>
            </Stack>
          </Stack>

          <Image
            alt={'Homepage Image'}
            objectFit={'cover'}
            width='60vh'
            src={EmptyPageImage}
          />
        </HStack>
      </Flex>
  );
}
