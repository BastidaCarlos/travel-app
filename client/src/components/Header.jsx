import { Link } from "react-router";
import APLogo from "../assets/AP-Logo.png";
import { 
    Flex, 
    Spacer, 
    Box, 
    Image, 
    HStack, 
    Link as ChakraLink,
    Drawer,
    IconButton,
    VStack
 } from "@chakra-ui/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";


function Header() {
    const [open, setOpen] = useState(false);

   return(
    <Flex 
        as="header"
        align="center"
        bg="white"
        color="fg"
        px={{ base: '4', sm: '4', md: '6', lg: '8' }}
        py={{ base: '3', md: '5' }}
        shadow="sm"
    >
        <Box
            maxW={{ md: '600px', lg: '900px'}}
        >
            <Image 
                src={APLogo}
                alt="Adventure Path Logo"
                width="150px"
                height="60px"
                objectFit="contain"
            />
        </Box>

        <Spacer />

        <HStack
            as="nav"
            display={{ base: 'none', lg: 'flex' }}
            gap={{ lg: '6', xl: '8' }}
        >
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
        
        <IconButton
            aria-label="Open Menu"
            variant="ghost"
            color="fg"
            display={{ base: 'flex', lg: 'none' }}
            onClick={() => setOpen(true) }
        >
            <Menu size={30} />
        </IconButton> 

        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Backdrop/>
            <Drawer.Positioner placement="right">
                <Drawer.Content>
                    <Drawer.Header
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Image
                            src={APLogo}
                            alt="Adventure Path Logo"
                            width="120px"
                            height="45px"
                            objectFit="contain"
                        />
                        <IconButton
                            aria-label="Close Menu"
                            variant="ghost"
                            color="red"
                            onClick={() => setOpen(false)}
                        >
                            <X size={30} />
                        </IconButton>
                    </Drawer.Header>
                    <Drawer.Body mt={8}>
                        <VStack align='stretch' gap={6}>
                            <ChakraLink
                                asChild
                                fontWeight="medium"
                                _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                onClick={() => setOpen(false)}
                            >
                                <Link to={'/'}>Landing</Link>
                            </ChakraLink>

                            <ChakraLink
                                asChild
                                fontWeight="medium"
                                _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                onClick={() => setOpen(false)}
                            >
                                <Link to={'/login'}>Login</Link>
                            </ChakraLink>

                            <ChakraLink
                                asChild
                                fontWeight="medium"
                                _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                onClick={() => setOpen(false)}
                            >
                                <Link to={'/itineraries'}>Itineraries</Link>
                            </ChakraLink>
                        </VStack>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Positioner> 
        </Drawer.Root>

    </Flex>
   ) 
}

export default Header;