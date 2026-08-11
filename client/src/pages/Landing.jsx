import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";
import HeroImage from "../assets/hero-adventure.webp"

// Import Styles components and Icons
import { 
    Button, 
    HStack,
    VStack,
    Flex,
    Grid,
    GridItem,
    Box,
    Heading,
    Image,
    Text
} from "@chakra-ui/react";
import { Compass, LogIn } from "lucide-react"


function Landing() {
    return (
        <Flex
            direction="column"
            minH="100vh"
        >
            <Header />

            <Grid 
                flex="1"
                templateAreas={{
                    base: `
                            "description"
                            "image"
                            "buttons"
                          `,
                    lg: `
                            "description image"
                            "buttons image" 
                          `
                }}
                templateColumns={{
                    base: "1fr",
                    lg: '1fr 1.2fr'
                }}
                alignItems="center"
                alignContent="center"
                textAlign={{
                    base: 'center',
                    lg: 'left'
                }}
                maxW={{
                    base: '100%',
                    md: '600px',
                    lg: '1000px'
                }}
                mx="auto"
                px={6}
                py={{
                    base: 12,
                    lg: 0
                }}
                gap={{
                    base: 8,
                    lg: 12
                }}
            >
                <GridItem area="description" display="flex" flexDirection="column" gap={4}>
                    <Heading
                        as="h1"
                        fontSize={{
                            base: '4xl',
                            lg: '5xl'
                        }}
                        fontWeight="bold"
                        color="fg.default"
                    >
                        Adventure Path
                    </Heading>

                    <Heading
                        as="h2"
                        fontSize="xl"
                        fontWeight="medium"
                        color="fg.muted"
                    >
                        Every trip deserves to be marked on the map
                    </Heading>

                    <Text as='p' fontSize="lg" color="fg.default">
                        Upload your favorite places and share your itineraries with other travelers
                    </Text>

                </GridItem>
                <GridItem
                    area="image"
                    display="flex"
                    flexDirection="column"
                    gap={6}
                >
                    <Image 
                        src={HeroImage}
                        alt="City sunset"
                        rounded="xl"
                        shadow="md"
                        w="100%"
                        objectFit="cover"
                    />

                </GridItem>
                <GridItem area="buttons">
                    <VStack gap={4} w="100%">
                        <Button 
                            asChild
                            bg="accent.solid"
                            color="white"
                            _hover={{ bg: "accent.emphasized" }}
                            width="100%"
                            size="lg"
                        >
                            <Link to={'/itineraries'}>
                                <Compass /> View Itineraries
                            </Link>
                        </Button>
                        <Button 
                            asChild
                            variant="outline"
                            borderColor="bg.emphasized"
                            color="bg.emphasized"
                            _hover={{ bg: "bg.canvas" }}
                            width="100%"
                            size="lg"
                        >
                            <Link to={'/login'}>
                                <LogIn /> Log In 
                            </Link>
                        </Button>
                    </VStack>
                </GridItem>
            </Grid>


            <Footer />
        </Flex>
    );
}

export default Landing;