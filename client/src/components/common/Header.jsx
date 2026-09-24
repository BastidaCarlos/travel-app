import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

import APLogo from "../../assets/AP-Logo.png";
import { 
    Box, 
    Button,
    Drawer,
    Flex, 
    HStack, 
    IconButton,
    Image, 
    Link as ChakraLink,
    Spacer, 
    VStack
 } from "@chakra-ui/react";
import { LogOut, Menu, X } from "lucide-react";


function Header() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const userPath = !user
        ? "/login"
        : user.role === 'admin'
            ? "/admin/dashboard"
            : "/profile/me"
   return(
    <Box
        as="header"
        bg="white"
        color="fg"
        shadow="sm"
        w="full"
    >
        <Flex 
            align="center"
            px={{ base: '4', sm: '4', md: '6', lg: '8' }}
            py={{ base: '3', md: '5' }}
            maxW={{
                base: '100%',
                lg: '900px',
                xl: '1200px'
            }}
            mx="auto"
        >
            <Box>
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
                    fontWeight={isActive('/') ? "bold" : 'medium'}
                    bg={isActive('/') ? 'ink.700' : 'transparent'}
                    p={isActive('/') ? '2' : 0 }
                    borderRadius={isActive('/') ? 'lg' : 'none'}
                    color={isActive('/') ? 'paper.50' : 'fg'}
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    <Link to={'/'}>Home</Link>
                </ChakraLink>

                <ChakraLink
                    asChild
                    fontWeight={isActive('/cities') ? "bold" : 'medium'}
                    bg={isActive('/cities') ? 'ink.700' : 'transparent'}
                    p={isActive('/cities') ? '2' : 0 }
                    borderRadius={isActive('/cities') ? 'lg' : 'none'}
                    color={isActive('/cities') ? 'paper.50' : 'fg'}
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    <Link to={'/cities'}>Cities</Link>
                </ChakraLink>

                <ChakraLink
                    asChild
                    fontWeight={isActive(userPath) ? "bold" : 'medium'}
                    bg={isActive(userPath) ? 'ink.700' : 'transparent'}
                    p={isActive(userPath) ? '2' : 0 }
                    borderRadius={isActive(userPath) ? 'lg' : 'none'}
                    color={isActive(userPath) ? 'paper.50' : 'fg'}
                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                >
                    {!user ? (
                        <Link to={'/login'}>Login</Link>
                    ): user.role === 'admin' ? (
                        <Link to={'/admin/dashboard'}>Admin Dashboard</Link>
                    ) : (
                        <Link to={'/profile/me'}>Profile</Link>
                    )}
                </ChakraLink>
                
                {user && (
                    <Button
                        variant="solid"
                        size="sm"
                        colorPalette='red'
                        onClick={() => logout()}
                    >
                        <LogOut /> Log Out
                    </Button>
                )}
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
                                    fontWeight={isActive('/') ? "bold" : 'medium'}
                                    bg={isActive('/') ? 'ink.700' : 'transparent'}
                                    p={isActive('/') ? '2' : 0 }
                                    borderRadius={isActive('/') ? 'lg' : 'none'}
                                    color={isActive('/') ? 'paper.50' : 'fg'}
                                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                    onClick={() => setOpen(false)}
                                >
                                    <Link to={'/'}>Landing</Link>
                                </ChakraLink>

                                <ChakraLink
                                    asChild
                                    fontWeight={isActive('/cities') ? "bold" : 'medium'}
                                    bg={isActive('/cities') ? 'ink.700' : 'transparent'}
                                    p={isActive('/cities') ? '2' : 0 }
                                    borderRadius={isActive('/cities') ? 'lg' : 'none'}
                                    color={isActive('/cities') ? 'paper.50' : 'fg'}
                                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                    onClick={() => setOpen(false)}
                                >
                                    <Link to={'/cities'}>Cities</Link>
                                </ChakraLink>

                                <ChakraLink
                                    asChild
                                    fontWeight={isActive(userPath) ? "bold" : 'medium'}
                                    bg={isActive(userPath) ? 'ink.700' : 'transparent'}
                                    p={isActive(userPath) ? '2' : 0 }
                                    borderRadius={isActive(userPath) ? 'lg' : 'none'}
                                    color={isActive(userPath) ? 'paper.50' : 'fg'}
                                    _hover={{ color: 'accent.solid', textDecoration: 'none' }}
                                    onClick={() => setOpen(false)}
                                >
                                    {!user ? (
                                        <Link to="/login">Log In</Link>
                                    ) : user.role === 'admin' ? (
                                        <Link to='/admin/dashboard'>Admin Dashboard</Link>
                                    ) : (
                                        <Link to='/profile/me'>Profile</Link>
                                    )}
                                </ChakraLink>
                                
                                {user && (
                                    <Button
                                        variant="solid"
                                        colorPalette="red"
                                        size="xs"
                                        onClick={() => logout()}
                                    >
                                        <LogOut /> Log Out
                                    </Button>
                                )}
                            </VStack>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner> 
            </Drawer.Root>
        </Flex>
    </Box>
   ) 
}

export default Header;