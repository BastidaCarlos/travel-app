import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import HeroImage from "../assets/hero-adventure.webp"

// Import Styles components and Icons
import { 
    Badge,
    Box,
    Button, 
    Flex,
    Heading,
    HStack,
    Image,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Compass, Earth, Feather, LogIn, Map, Pin, Plus } from "lucide-react"

function Landing() {
    const { user } = useAuth();
    return (
        <Box>
            <Header />

            <Flex
                direction="column"
                gap={6}
            >
                <Flex
                    direction={{ base: 'column', md: 'row'}}
                    w="full"
                    minH={{ base: "50vh", md: '40vh', lg: '80vh' }}
                    maxW={{
                        base: '90%',
                        lg: "900px",
                        xl: "1200px"
                    }}
                    mx="auto"
                    my={10}
                    bg="paper.100"
                    borderRadius="xl"
                    boxShadow="xl"
                    borderColor='paper.300'
                    justifyContent="center"
                    alignItems="center"
                >
                    <VStack 
                        w="full"
                        p={6}
                        textAlign={{ base: 'center', md: 'left'}}
                        alignItems={{ base: 'center', md: "flex-start"}}
                    >
                        <Heading as="h1" fontSize={{ base: '2xl', lg: '3xl'}} color="ink" fontWeight="bold">Adventure Path</Heading>
                        <Badge size="lg" bg="ink.600" color="white">Your Personal Travel Logbook</Badge>
                        <Text as="p">
                            Every Trip Deserves to Be Marked on the Map
                        </Text>

                        <Text as="p">
                            Discover curated routes, craft your custom itineraries, and share...
                        </Text>
                        <HStack>
                            <Button
                                asChild
                                bg="accent.solid"
                                _hover={{ bg: "accent.emphasized"}}
                            >
                                <HStack>
                                    <Compass /> 
                                    <Link to="/cities">Explore Itineraries</Link> 
                                </HStack>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                borderColor="stamp.400"
                                _hover={{ bg: "stamp.400"}}
                            >
                                { user ? (
                                    <HStack>
                                        <Plus />
                                        <Link to="/profile/create-itinerary">Create</Link>
                                    </HStack>
                                ) : (
                                    <HStack>
                                        <LogIn />
                                        <Link to="/login">Log In</Link>
                                    </HStack>
                                )}
                            </Button>
                        </HStack>
                    </VStack>
                    <Image 
                        src={HeroImage}
                        maxW={{ base: '100%', md: '50%'}}
                        borderRadius="2xl"
                        boxShadow="xl"
                        objectFit="cover"
                        alignSelf="stretch"
                    />
                </Flex>

                <Box
                    bg="paper.100"
                    maxW={{ base: '90%', lg: '900px', xl: '1200px'}}
                    mx='auto'
                    border="1px dashed"
                    borderColor="paper.300"
                    borderRadius="xl"
                >
                    <SimpleGrid
                        columns={{ base: '1', md: '2'}}
                        gap={4}
                        mb={4}
                        p={4}
                    >
                        <Box w="full">
                            <Badge bg="amber.100" color="amber.800" size="md" mb={2}>OUR STORY</Badge>
                            <Heading as="h2" color="ink" mb={2}>Inpired by Vintage Logbooks, Build for Modern Explorers</Heading>
                            <Text fontSize="md" color="teal.700">
                                Adventure Path was born to bring clarity back to travel planning. We transform scattered ideas into clean, day-by-day routes—so you can spend less time avoiding tourist traps and more time experiencing authentic local culture
                            </Text>
                        </Box>
                        <Box>
                            <VStack
                                alignItems="flex-start"
                            >
                                <Badge bg="stamp.500" color="white">Authentic Routes</Badge>
                                <HStack>
                                    <Pin size={20}/> 
                                    <Text fontSize="sm">Curated by real travelers, not algoritms</Text>
                                </HStack>

                                <Badge bg="stamp.500" color="white">Thoughtful Pacing</Badge>
                                <HStack>
                                    <Pin size={20}/> 
                                    <Text fontSize="sm">Balanced daily schedules with realistic timeframes and budget</Text>
                                </HStack>

                                <Badge bg="stamp.500" color="white">Open Logbook</Badge>
                                <HStack>
                                    <Pin size={20}/> 
                                    <Text fontSize="sm">Document your own journeys and pass the map forward</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </SimpleGrid>
                </Box>

                <SimpleGrid
                    columns={{ base: '1', md: '3'}}
                    maxW={{ base: '90%', lg: '900px', xl: '1200px'}}
                    mx="auto"
                    gap={4}
                    mb={4}
                >
                    <VStack
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        textAlign="center"
                    >
                        <Box
                            display="flex"
                            boxSize="80px"
                            borderRadius="full"
                            bg="amber.100"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Map color="#AB6E14"/>
                        </Box>
                        <Heading as="h3" fontSize="lg" fontWeight="medium" color="ink">
                            Curated Routes
                        </Heading>
                        <Text color='teal.700'>
                            Explore day-by-day Itineraries tailored by duration, budget and travel style.
                        </Text>
                    </VStack>

                    <VStack
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        textAlign="center"
                    >
                        <Box
                            display="flex"
                            boxSize="80px"
                            borderRadius="full"
                            bg="amber.100"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Feather color="#AB6E14"/>
                        </Box>
                        <Heading as="h3" fontSize="lg" fontWeight="medium" color="ink">
                            Custom Paths
                        </Heading>
                        <Text color="teal.700">
                            Organize your favorites stops, hidden spots, and local trips into clean schedules.
                        </Text>
                    </VStack>

                    <VStack
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="lg"
                        p={6}
                        textAlign="center"
                    >
                        <Box
                            display="flex"
                            boxSize="80px"
                            borderRadius="full"
                            bg="amber.100"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Earth color="#AB6E14"/>
                        </Box>
                        <Heading as="h3" fontSize="lg" fontWeight="medium" color="ink">
                            Travel Community
                        </Heading>
                        <Text color="teal.700">
                            Connect with fellow travelers and get authentic recommendations for your next destination.
                        </Text>
                    </VStack>
                </SimpleGrid>

                <Box
                    maxW={{ base: '90%', lg: '900px', xl: '1200px' }}
                    bg="teal.800"
                    borderRadius="lg"
                    w="full"
                    mx="auto"
                    textAlign="center"
                    color="paper.50"
                    mb={6}
                    p={10}
                >
                    <Heading as="h3">Ready to Plan Your Next Adventure?</Heading>
                    <Text>Browse destinations or pin your favorite routes today</Text>
                    <Button
                        asChild
                        bg="amber.400"
                        mt={4}
                        color="ink"
                    >
                        <Link to="/cities">Browse Cities</Link>
                    </Button>
                </Box>

            </Flex>

            <Footer />
        </Box>
    );
}

export default Landing;