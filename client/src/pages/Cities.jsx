import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Imports from Chakra UI and Icons
import { 
    Box, 
    VStack,
    Spinner,
    Text,
    Alert,
    Grid,
    Heading,
    Button,
    Card,
    Image,
    CloseButton,
    Input,
    InputGroup
} from "@chakra-ui/react";

import { Timeline, Search } from "lucide-react";

function Cities() {
    const navigate = useNavigate();
    const { cities, citiesIsLoading, citiesError, fetchCities } = useContext(AppContext);

    useEffect(() => {
        fetchCities();
    }, [])

    const inputRef = useRef(null);

    // Logic for filters
    // Search Filter
    const [searchTerm, setSearchTerm] = useState('');

    const handleClearSearch = () => {
        setSearchTerm('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const endElement = searchTerm ? (
        <CloseButton
            size="xs"
            onClick={handleClearSearch}
            me="-2"
        >

        </CloseButton>
    ) : undefined

    const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>

            <Header />

            <Box
                as="main"
                display="flex"
                flexDirection="column"
                minH="100vh"
                maxW="900px"
                mx="auto"
                alignItems="center"
                justifyContent="flex-start"
                py={10}
                px={4}
            >
                {/* Errors and loadings states */}
                {citiesIsLoading && (
                    <VStack>
                        <Spinner 
                            size="xl"
                            color="fg.emphasized"
                        /> 
                        <Text size="xl" color="fg.emphasized" fontWeight="bold">Loading Cities...</Text>
                    </VStack>
                )}

                {citiesError && (
                    <Box my={4} width="100%" maxW="sm" px={4}>
                        <Alert.Root 
                            status="error" 
                            variant="subtle" 
                            p={6}
                            radius="md"
                        >
                            <VStack
                                width="100%"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                gap={2}
                            >
                                <Alert.Indicator />
                                <Alert.Title mt={4} fontSize="xl" fontWeight="bold">
                                    Error connection
                                </Alert.Title>
                                <Alert.Description maxWidth="sm">
                                    {citiesError}
                                </Alert.Description>
                            </VStack>
                        </Alert.Root>
                    </Box>
                )}

                {/* Layout for the cards of the cities */}
                <Heading
                    as="h1"
                >
                    Cities List
                </Heading>

                <InputGroup 
                    width="100%"
                    maxW="900px"
                    px={8}
                    mb={6}
                    startElement={<Search size={18}/>}
                    endElement={endElement}
                >
                    <Input 
                        ref={inputRef}
                        variant="flushed"
                        placeholder="Search City..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    />
                </InputGroup>

                
                {!citiesIsLoading && !citiesError && filteredCities.length === 0 && (
                    <Box my={4} width="100%" maxW="sm" px={4} textAlign="center">
                        <Alert.Root status="info" variant="subtle" title="No cities were found that match your search">
                            <Alert.Title fontSize="md">No cities match "{searchTerm}"</Alert.Title>
                        </Alert.Root>
                    </Box>
                )}

                <Grid
                    templateColumns={{ 
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)"
                    }}
                    maxW="900px"
                    gap={4}
                    px={8}
                >
                    {filteredCities.map((city) => (
                        <Card.Root
                            key={city._id}
                            as="article"
                        >
                            <Image 
                                src={city.image}
                                alt={city.name}
                                fit="cover"
                            />
                            <Card.Body gap="2">
                                <Card.Title>{city.name}</Card.Title>
                                <Card.Description> {city.country} </Card.Description>
                            </Card.Body>
                            <Card.Footer gap="2">
                                <Button 
                                    variant="solid" 
                                    colorPalette="teal"
                                    onClick={() => navigate(`/itineraries/${city._id}`)}
                                >
                                    <Timeline /> See Itineraries
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    ))}
                </Grid>

            </Box>

            <Footer />

        </Box>
    ) 
}

export default Cities;