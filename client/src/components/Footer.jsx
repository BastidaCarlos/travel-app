import { 
    Flex,
    Text,
    Image,
    HStack,
    VStack,
    Link as ChakraLink
 } from "@chakra-ui/react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router";

function Footer() {
    return(
        <Flex 
            as="footer"
            direction="column"
            alignItems="center"
            gap={6}
            mt="auto"
            py={6}
            px={4}
            bg="white"
            borderTop="1px solid"
            borderColor="paper.200"
        >
            <VStack gap={2}>
                <Image 
                    src={Logo}
                    alt="Adventure Path Logo"
                    width="50px"
                    height="50px"
                    objectFit="contain"
                /> 
                <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="fg.muted"
                >
                    &copy; {new Date().getFullYear()} Adventure Path. All rights reserved
                </Text>
            </VStack>
            <HStack>
                <ChakraLink
                    asChild
                    fontWeight="medium"
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    <Link to={'/'}>Landing</Link>
                </ChakraLink>

                <ChakraLink
                    asChild
                    fontWeight="medium"
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    <Link to={'/login'}>Login</Link>
                </ChakraLink>

                <ChakraLink
                    asChild
                    fontWeight="medium"
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    <Link to={'/itineraries'}>Itineraries</Link>
                </ChakraLink>
            </HStack>
        </Flex>
    )
}

export default Footer;